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
	"github.com/pubg/kubeconfig-updater/backend/controller/application_service"
	"github.com/pubg/kubeconfig-updater/backend/controller/kubeconfig_service"
	"github.com/pubg/kubeconfig-updater/backend/controller/protos"
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

	CredService     *cred_resolver_service.CredResolverService
	RegisterService *cluster_register_service.ClusterRegisterService
	MetaService     *cluster_metadata_service.ClusterMetadataService

	KubeconfigController  protos.KubeconfigServer
	ApplicationController protos.ApplicationServer

	GrpcServer    *grpc.Server
	GrpcWebServer *http.Server

	//Lifecycle
	ApplicationClose chan bool
}

func (s *ServerApplication) InitApplication(option *ServerApplicationOption) error {
	err := s.initPersistLayer(option)
	if err != nil {
		return err
	}
	s.initServiceLayer(option)
	s.initControllerLayer(option)
	return nil
}

type ServerApplicationOption struct {
	//Persist
	CredResolverConfigPath             string
	AggregatedClusterMetadataCachePath string

	//Listener
	UseMockController bool
}

func (s *ServerApplication) StartApplication(grpcPort int, grpcWebPort int) {
	go func() {
		listener, err := net.Listen("tcp", fmt.Sprintf("localhost:%d", grpcPort))
		if err != nil {
			log.Fatalf("failed to listen: %v", err)
		}
		fmt.Printf("Grpc Server listen http://localhost:%d\n", grpcPort)
		err = s.GrpcServer.Serve(listener)
		if err != nil {
			log.Fatalf("failed to start grpc server: %v", err)
		}
	}()

	go func() {
		fmt.Printf("Grpc Web Server listen http://localhost:%d\n", grpcWebPort)
		s.GrpcWebServer.Addr = fmt.Sprintf("localhost:%d", grpcWebPort)
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

func (s *ServerApplication) initControllerLayer(option *ServerApplicationOption) {
	s.GrpcServer = grpc.NewServer()
	reflection.Register(s.GrpcServer)
	protos.RegisterApplicationServer(s.GrpcServer, application_service.NewController())
	if option.UseMockController {
		protos.RegisterKubeconfigServer(s.GrpcServer, kubeconfig_service.NewMockController())
	} else {
		protos.RegisterKubeconfigServer(s.GrpcServer, kubeconfig_service.NewKubeconfigService(s.CredService, s.RegisterService, s.MetaService))
	}

	wrappedGrpc := grpcweb.WrapServer(s.GrpcServer)
	mux := http.NewServeMux()
	mux.HandleFunc("/", func(res http.ResponseWriter, req *http.Request) {
		if wrappedGrpc.IsGrpcWebRequest(req) {
			wrappedGrpc.ServeHTTP(res, req)
			return
		}
		fmt.Println("Web Requests")
		// Fall back to other servers.
		// TODO: Add Grpc-Web Swagger
		http.DefaultServeMux.ServeHTTP(res, req)
	})
	s.GrpcWebServer = &http.Server{Addr: "fill-after-func", Handler: mux}
	s.ApplicationClose = make(chan bool, 1)
}

func (s *ServerApplication) initServiceLayer(option *ServerApplicationOption) {
	//Where is DI?
	s.CredService = cred_resolver_service.NewCredResolverService(s.CredResolverConfigStorage)
	s.MetaService = cluster_metadata_service.NewClusterMetadataService(s.CredService, s.AggreagtedClusterMetadataCacheStorage)
	s.RegisterService = cluster_register_service.NewClusterRegisterService(s.CredService, s.MetaService)
}

func (s *ServerApplication) initPersistLayer(option *ServerApplicationOption) error {
	s.CredResolverConfigStorage = &cred_resolver_config_persist.CredResolverConfigStorage{
		StoragePath: option.CredResolverConfigPath,
	}
	firstLoad, err := s.CredResolverConfigStorage.LoadStorage()
	if err != nil {
		return err
	}

	s.AggreagtedClusterMetadataCacheStorage = &cluster_metadata_persist.AggregatedClusterMetadataStorage{
		StoragePath: option.AggregatedClusterMetadataCachePath,
	}
	_, err = s.AggreagtedClusterMetadataCacheStorage.LoadStorage()
	if err != nil {
		return err
	}

	if firstLoad {
		err = s.CredResolverConfigStorage.SetConfig(&protos.CredResolverConfig{
			AccountId:          "548322143865",
			InfraVendor:        "AWS",
			AccountAlias:       "pubg-xtrm",
			Kind:               protos.CredentialResolverKind_PROFILE,
			ResolverAttributes: map[string]string{"profile": "mfa"},
			Status:             protos.CredentialResolverStatus_CRED_REGISTERED_OK,
		})
		if err != nil {
			return err
		}

		err = s.CredResolverConfigStorage.SetConfig(&protos.CredResolverConfig{
			AccountId:          "418047124903",
			InfraVendor:        "AWS",
			AccountAlias:       "xtrm-newstate",
			Kind:               protos.CredentialResolverKind_PROFILE,
			ResolverAttributes: map[string]string{"profile": "mfan"},
			Status:             protos.CredentialResolverStatus_CRED_REGISTERED_OK,
		})
		if err != nil {
			return err
		}

		err = s.CredResolverConfigStorage.SetConfig(&protos.CredResolverConfig{
			AccountId:          "350993443303",
			InfraVendor:        "AWS",
			AccountAlias:       "xtrm-playground",
			Kind:               protos.CredentialResolverKind_PROFILE,
			ResolverAttributes: map[string]string{"profile": "mfap"},
			Status:             protos.CredentialResolverStatus_CRED_REGISTERED_OK,
		})
		if err != nil {
			return err
		}

		err = s.CredResolverConfigStorage.SetConfig(&protos.CredResolverConfig{
			AccountId:          "200019689895",
			InfraVendor:        "Tencent",
			AccountAlias:       "xtrm-newstate",
			Kind:               protos.CredentialResolverKind_PROFILE,
			ResolverAttributes: map[string]string{"profile": "default"},
			Status:             protos.CredentialResolverStatus_CRED_REGISTERED_OK,
		})
		if err != nil {
			return err
		}

		err = s.CredResolverConfigStorage.SetConfig(&protos.CredResolverConfig{
			AccountId:          "200022166252",
			InfraVendor:        "Tencent",
			AccountAlias:       "xtrm-playground",
			Kind:               protos.CredentialResolverKind_PROFILE,
			ResolverAttributes: map[string]string{"profile": "dev"},
			Status:             protos.CredentialResolverStatus_CRED_REGISTERED_OK,
		})
		if err != nil {
			return err
		}

		err = s.CredResolverConfigStorage.SetConfig(&protos.CredResolverConfig{
			AccountId:          "f073f292-7255-416f-adaf-34b476e050be",
			InfraVendor:        "Azure",
			AccountAlias:       "xtrm-newstate",
			Kind:               protos.CredentialResolverKind_DEFAULT,
			ResolverAttributes: map[string]string{},
			Status:             protos.CredentialResolverStatus_CRED_REGISTERED_OK,
		})
		if err != nil {
			return err
		}

		err = s.CredResolverConfigStorage.SaveStorage()
		if err != nil {
			return err
		}
	}

	return nil
}
