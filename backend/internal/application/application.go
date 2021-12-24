package application

import (
	"fmt"
	"log"
	"net"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"github.com/improbable-eng/grpc-web/go/grpcweb"
	"github.com/pubg/kubeconfig-updater/backend/controller/application_controller"
	"github.com/pubg/kubeconfig-updater/backend/controller/kubeconfig_controller"
	"github.com/pubg/kubeconfig-updater/backend/controller/protos"
	"github.com/pubg/kubeconfig-updater/backend/internal/application/configs"
	"github.com/pubg/kubeconfig-updater/backend/internal/common"
	"github.com/pubg/kubeconfig-updater/backend/pkg/persistence/cluster_metadata_persist"
	"github.com/pubg/kubeconfig-updater/backend/pkg/persistence/cred_resolver_config_persist"
	"github.com/pubg/kubeconfig-updater/backend/pkg/service/cluster_metadata_service"
	"github.com/pubg/kubeconfig-updater/backend/pkg/service/cluster_register_service"
	"github.com/pubg/kubeconfig-updater/backend/pkg/service/cred_resolver_service"
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
	err := s.initApplicationConfig(option.ConfigPath)
	if err != nil {
		return err
	}
	err = s.initPersistLayer(s.Config.DataStores.CredResolverConfig, s.Config.DataStores.AggregatedClusterMetadata)
	if err != nil {
		return err
	}
	s.initServiceLayer()
	s.initControllerLayer(option.UseMockController)
	return nil
}

type ServerApplicationOption struct {
	GrpcPort          int
	GrpcWebPort       int
	ConfigPath        string
	UseMockController bool
}

func (s *ServerApplication) initApplicationConfig(basPath string) error {
	err := configs.CheckExistsOrCreateDefault(basPath)
	if err != nil {
		return err
	}
	cfg, err := configs.LoadConfig(basPath)
	if err != nil {
		return err
	}
	s.Config = cfg
	return err
}

func (s *ServerApplication) initControllerLayer(useMockController bool) {
	s.GrpcServer = grpc.NewServer()
	reflection.Register(s.GrpcServer)
	protos.RegisterApplicationServer(s.GrpcServer, application_controller.NewController())
	if useMockController {
		protos.RegisterKubeconfigServer(s.GrpcServer, kubeconfig_controller.NewMockController())
	} else {
		protos.RegisterKubeconfigServer(s.GrpcServer, kubeconfig_controller.NewKubeconfigService(s.CredStoreService, s.RegisterService, s.MetaService))
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

func (s *ServerApplication) initServiceLayer() {
	//Where is DI?
	s.CredStoreService = cred_resolver_service.NewCredResolverService(s.CredResolverConfigStorage)
	s.CredService = cred_resolver_service.NewCredResolveService(s.CredStoreService)
	s.MetaService = cluster_metadata_service.NewClusterMetadataService(s.CredService, s.CredStoreService, s.AggreagtedClusterMetadataCacheStorage, s.Config)
	s.RegisterService = cluster_register_service.NewClusterRegisterService(s.CredService, s.MetaService)
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

	//if firstLoad {
	//	err = s.CredResolverConfigStorage.SetConfig(&protos.CredResolverConfig{
	//		AccountId:          "548322143865",
	//		InfraVendor:        "AWS",
	//		AccountAlias:       "pubg-xtrm",
	//		Kind:               protos.CredentialResolverKind_PROFILE,
	//		ResolverAttributes: map[string]string{"profile": "mfa"},
	//		Status:             protos.CredentialResolverStatus_CRED_REGISTERED_OK,
	//	})
	//	if err != nil {
	//		return err
	//	}
	//
	//	err = s.CredResolverConfigStorage.SetConfig(&protos.CredResolverConfig{
	//		AccountId:          "418047124903",
	//		InfraVendor:        "AWS",
	//		AccountAlias:       "xtrm-newstate",
	//		Kind:               protos.CredentialResolverKind_PROFILE,
	//		ResolverAttributes: map[string]string{"profile": "mfan"},
	//		Status:             protos.CredentialResolverStatus_CRED_REGISTERED_OK,
	//	})
	//	if err != nil {
	//		return err
	//	}
	//
	//	err = s.CredResolverConfigStorage.SetConfig(&protos.CredResolverConfig{
	//		AccountId:          "350993443303",
	//		InfraVendor:        "AWS",
	//		AccountAlias:       "xtrm-playground",
	//		Kind:               protos.CredentialResolverKind_PROFILE,
	//		ResolverAttributes: map[string]string{"profile": "mfap"},
	//		Status:             protos.CredentialResolverStatus_CRED_REGISTERED_OK,
	//	})
	//	if err != nil {
	//		return err
	//	}
	//
	//	err = s.CredResolverConfigStorage.SetConfig(&protos.CredResolverConfig{
	//		AccountId:          "200019689895",
	//		InfraVendor:        "Tencent",
	//		AccountAlias:       "xtrm-newstate",
	//		Kind:               protos.CredentialResolverKind_PROFILE,
	//		ResolverAttributes: map[string]string{"profile": "default"},
	//		Status:             protos.CredentialResolverStatus_CRED_REGISTERED_OK,
	//	})
	//	if err != nil {
	//		return err
	//	}
	//
	//	err = s.CredResolverConfigStorage.SetConfig(&protos.CredResolverConfig{
	//		AccountId:          "200022166252",
	//		InfraVendor:        "Tencent",
	//		AccountAlias:       "xtrm-playground",
	//		Kind:               protos.CredentialResolverKind_PROFILE,
	//		ResolverAttributes: map[string]string{"profile": "dev"},
	//		Status:             protos.CredentialResolverStatus_CRED_REGISTERED_OK,
	//	})
	//	if err != nil {
	//		return err
	//	}
	//
	//	err = s.CredResolverConfigStorage.SetConfig(&protos.CredResolverConfig{
	//		AccountId:          "f073f292-7255-416f-adaf-34b476e050be",
	//		InfraVendor:        "Azure",
	//		AccountAlias:       "xtrm-newstate",
	//		Kind:               protos.CredentialResolverKind_DEFAULT,
	//		ResolverAttributes: map[string]string{},
	//		Status:             protos.CredentialResolverStatus_CRED_REGISTERED_OK,
	//	})
	//	if err != nil {
	//		return err
	//	}
	//
	//	err = s.CredResolverConfigStorage.SaveStorage()
	//	if err != nil {
	//		return err
	//	}
	//}

	return nil
}
