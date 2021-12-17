package server

import (
	"fmt"
	"log"
	"net"
	"net/http"
	"os"

	"github.com/improbable-eng/grpc-web/go/grpcweb"
	"github.com/pubg/kubeconfig-updater/backend/controller/kubeconfig_service"
	"github.com/pubg/kubeconfig-updater/backend/controller/kubeconfig_service/protos"
	"github.com/pubg/kubeconfig-updater/backend/pkg/application"
	"github.com/spf13/cobra"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
)

func Cmd() *cobra.Command {
	var serverCmd = &cobra.Command{
		Use:   "server",
		Short: "headless 서버 모드로 동작",
		Long:  `kubeconfig-updater를 headless 서버 모드로 동작하는 명령`,
	}

	grpcPort := 0
	grpbWebPort := 0
	useMock := false
	//daemonMode := false

	flags := serverCmd.Flags()
	flags.IntVar(&grpcPort, "port", 10980, "Grpc Listen Port")
	flags.IntVar(&grpbWebPort, "web-port", 10981, "Grpc-Web Listen Port")
	flags.BoolVar(&useMock, "mock", false, "Use Mock Controller")
	//flags.BoolVar(&daemonMode, "daemon", false, "Run as background process")

	serverCmd.RunE = func(cmd *cobra.Command, args []string) error {
		grpcServer := grpc.NewServer()
		reflection.Register(grpcServer)
		if useMock {
			protos.RegisterKubeconfigServer(grpcServer, kubeconfig_service.NewMockController())
		} else {
			protos.RegisterKubeconfigServer(grpcServer, kubeconfig_service.NewController())
		}

		dirname, err := os.UserHomeDir()
		if err != nil {
			return err
		}
		app := &application.ServerApplication{}
		err = app.InitApplication(&application.ServerApplicationOption{
			CredResolverConfigPath: fmt.Sprintf("%s/.kubeconfig-updater-gui/cred-resolver-config.json", dirname),
			ClusterMetadataCachePath: fmt.Sprintf("%s/.kubeconfig-updater-gui/cluster-metadata-cache.json", dirname),
			AggregatedClusterMetadataCachePath: fmt.Sprintf("%s/.kubeconfig-updater-gui/aggregated-cluster-metadata-cache.json", dirname),
		})
		if err != nil {
			return err
		}
		application.SetApplication(app)

		done := make(chan bool, 1)
		go runGrpcWebServer(grpbWebPort, grpcServer, done)
		go runGrpcServer(grpcPort, grpcServer, done)
		fmt.Printf("Wait until server close...\n")
		<-done
		fmt.Printf("Server closed, finish process\n")
		return nil
	}

	return serverCmd
}

func runGrpcServer(port int, server *grpc.Server, done chan bool) {
	listener, err := net.Listen("tcp", fmt.Sprintf("localhost:%d", port))
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	fmt.Printf("Grpc Server listen http://localhost:%d\n", port)
	err = server.Serve(listener)
	if err != nil {
		log.Fatalf("failed to start grpc server: %v", err)
	}
	server.Stop()
	done <- true
}

func runGrpcWebServer(port int, server *grpc.Server, done chan bool) {
	fmt.Printf("Grpc Web Server listen http://localhost:%d\n", port)
	wrappedGrpc := grpcweb.WrapServer(server)

	mux := http.NewServeMux()
	mux.HandleFunc("/", func(res http.ResponseWriter, req *http.Request) {
		if wrappedGrpc.IsGrpcWebRequest(req) {
			wrappedGrpc.ServeHTTP(res, req)
			return
		}
		fmt.Println("Web Requests")
		// Fall back to other servers.
		http.DefaultServeMux.ServeHTTP(res, req)
	})
	err := http.ListenAndServe(fmt.Sprintf("localhost:%d", port), mux)
	if err != nil {
		log.Fatalf("failed to start grpc-web server: %v", err)
	}
	server.Stop()
	done <- true
}
