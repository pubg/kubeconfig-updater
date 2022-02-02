package application

import (
	"context"
	"fmt"
	"log"
	"net"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"syscall"

	grpc_middleware "github.com/grpc-ecosystem/go-grpc-middleware"
	grpc_zap "github.com/grpc-ecosystem/go-grpc-middleware/logging/zap"
	"github.com/improbable-eng/grpc-web/go/grpcweb"
	"github.com/pubg/kubeconfig-updater/backend/application/configs"
	"github.com/pubg/kubeconfig-updater/backend/controller/application_controller"
	"github.com/pubg/kubeconfig-updater/backend/controller/kubeconfig_controller"
	"github.com/pubg/kubeconfig-updater/backend/controller/protos"
	"github.com/pubg/kubeconfig-updater/backend/pkg/common"
	"github.com/pubg/kubeconfig-updater/backend/pkg/persistence/cluster_metadata_persist"
	"github.com/pubg/kubeconfig-updater/backend/pkg/persistence/cred_resolver_config_persist"
	"github.com/pubg/kubeconfig-updater/backend/pkg/service/cluster_metadata_service"
	"github.com/pubg/kubeconfig-updater/backend/pkg/service/cluster_register_service"
	"github.com/pubg/kubeconfig-updater/backend/pkg/service/cred_resolver_service"
	"go.uber.org/zap"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
)

type ServerApplication struct {
	CredResolverConfigStorage             *cred_resolver_config_persist.CredResolverConfigStorage
	AggreagtedClusterMetadataCacheStorage *cluster_metadata_persist.AggregatedClusterMetadataStorage

	CredService      *cred_resolver_service.CredResolveService
	CredStoreService *cred_resolver_service.CredResolverStoreService
	RegisterService  *cluster_register_service.ClusterRegisterService
	MetaService      *cluster_metadata_service.ClusterMetadataService

	KubeconfigController  protos.KubeconfigServer
	ApplicationController protos.ApplicationServer

	GrpcServer    *grpc.Server
	GrpcPort      int
	GrpcWebServer *http.Server
	GrpcWebPort   int

	Config *configs.ApplicationConfig

	//Lifecycle
	ApplicationClose chan bool
}

func (s *ServerApplication) StartApplication() {
	go func() {
		listener, err := net.Listen("tcp", fmt.Sprintf("localhost:%d", s.GrpcPort))
		if err != nil {
			log.Fatalf("failed to listen: %v", err)
		}
		fmt.Printf("Grpc Server listen http://localhost:%d\n", s.GrpcPort)
		err = s.GrpcServer.Serve(listener)
		if err != nil {
			log.Fatalf("failed to start grpc server: %v", err)
		}
	}()

	go func() {
		fmt.Printf("Grpc Web Server listen http://localhost:%d\n", s.GrpcWebPort)
		s.GrpcWebServer.Addr = fmt.Sprintf("localhost:%d", s.GrpcWebPort)
		err := s.GrpcWebServer.ListenAndServe()
		if err != nil {
			log.Fatalf("failed to start grpc-web server: %v", err)
		}
	}()

	sigc := make(chan os.Signal, 1)
	signal.Notify(sigc,
		syscall.SIGHUP,
		syscall.SIGINT,
		syscall.SIGTERM,
		syscall.SIGQUIT)
	go func() {
		sig := <-sigc
		fmt.Printf("Received signal %+v\n", sig)
		s.CloseApplication()
		fmt.Printf("Closed Application\n")
		s.ApplicationClose <- true
	}()
}

func (s *ServerApplication) CloseApplication() {
	s.GrpcServer.Stop()
	err := s.GrpcWebServer.Close()
	if err != nil {
		log.Fatalf("Failed to close Grpc-Web Server: %+v\n", err)
	}
}

func (s *ServerApplication) InitApplication(option *ServerApplicationOption) error {
	s.GrpcPort = option.GrpcPort
	s.GrpcWebPort = option.GrpcWebPort
	err := s.initApplicationConfig(option.AbsConfigPath)
	if err != nil {
		return err
	}
	err = s.initPersistLayer(s.Config.DataStores.CredResolverConfig, s.Config.DataStores.AggregatedClusterMetadata)
	if err != nil {
		return err
	}
	err = s.initServiceLayer()
	if err != nil {
		return err
	}
	s.initControllerLayer(option.UseMockController)
	return nil
}

type ServerApplicationOption struct {
	GrpcPort          int
	GrpcWebPort       int
	AbsConfigPath     string
	UseMockController bool
}

func (s *ServerApplication) initApplicationConfig(absPath string) error {
	cfg, err := configs.ResolveConfig(absPath)
	if err != nil {
		return err
	}
	s.Config = cfg
	return err
}

func (s *ServerApplication) initControllerLayer(useMockController bool) {
	logger, _ := zap.NewProduction()
	defer logger.Sync() // flushes buffer, if any

	grpcOption := grpc.UnaryInterceptor(grpc_middleware.ChainUnaryServer(
		grpc_zap.PayloadUnaryServerInterceptor(logger, func(ctx context.Context, fullMethodName string, servingObject interface{}) bool {
			return !strings.Contains(fullMethodName, "GetAvailable")
		}),
		grpc_zap.UnaryServerInterceptor(logger),
	))
	s.GrpcServer = grpc.NewServer(grpcOption)
	reflection.Register(s.GrpcServer)

	protos.RegisterApplicationServer(s.GrpcServer, application_controller.NewController())
	if useMockController {
		protos.RegisterKubeconfigServer(s.GrpcServer, kubeconfig_controller.NewMockController())
	} else {
		protos.RegisterKubeconfigServer(s.GrpcServer, kubeconfig_controller.NewKubeconfigService(s.CredStoreService, s.CredService, s.RegisterService, s.MetaService))
	}

	wrappedGrpc := grpcweb.WrapServer(s.GrpcServer, grpcweb.WithOriginFunc(func(_ string) bool { return true }))
	mux := http.NewServeMux()
	mux.HandleFunc("/", func(res http.ResponseWriter, req *http.Request) {
		if wrappedGrpc.IsAcceptableGrpcCorsRequest(req) || wrappedGrpc.IsGrpcWebRequest(req) {
			wrappedGrpc.ServeHTTP(res, req)
			return
		}
		fmt.Println("Web Requests")
		// Fallback to other servers.
		// TODO: Add Grpc-Web Swagger
		http.DefaultServeMux.ServeHTTP(res, req)
	})
	s.GrpcWebServer = &http.Server{Addr: "fill-after-func", Handler: mux}
	s.ApplicationClose = make(chan bool, 1)
}

func (s *ServerApplication) initServiceLayer() error {
	var err error
	//Where is DI?
	s.CredStoreService, err = cred_resolver_service.NewCredResolverService(s.CredResolverConfigStorage)
	if err != nil {
		return err
	}
	s.CredService = cred_resolver_service.NewCredResolveService(s.CredStoreService)
	s.MetaService = cluster_metadata_service.NewClusterMetadataService(s.CredService, s.CredStoreService, s.AggreagtedClusterMetadataCacheStorage, s.Config)
	s.RegisterService = cluster_register_service.NewClusterRegisterService(s.CredService, s.MetaService, s.Config.Extensions)
	return nil
}

func (s *ServerApplication) initPersistLayer(credResolverConfig *configs.DataStoreConfig, aggrClstMetaConfig *configs.DataStoreConfig) error {
	credAbsPath, err := common.ResolvePathToAbs(credResolverConfig.Path)
	if err != nil {
		return err
	}
	s.CredResolverConfigStorage = &cred_resolver_config_persist.CredResolverConfigStorage{
		StoragePath: credAbsPath,
	}
	_, err = s.CredResolverConfigStorage.LoadStorage()
	if err != nil {
		return err
	}

	aggrMetaPath, err := common.ResolvePathToAbs(aggrClstMetaConfig.Path)
	if err != nil {
		return err
	}
	s.AggreagtedClusterMetadataCacheStorage = &cluster_metadata_persist.AggregatedClusterMetadataStorage{
		StoragePath: aggrMetaPath,
	}
	_, err = s.AggreagtedClusterMetadataCacheStorage.LoadStorage()
	if err != nil {
		return err
	}

	return nil
}
