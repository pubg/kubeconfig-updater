package server

import (
	"fmt"

	"github.com/pubg/kubeconfig-updater/backend/internal/application"
	"github.com/pubg/kubeconfig-updater/backend/internal/common"
	"github.com/spf13/cobra"
)

func Cmd() *cobra.Command {
	var serverCmd = &cobra.Command{
		Use:   "server",
		Short: "headless 서버 모드로 동작",
		Long:  `kubeconfig-updater를 headless 서버 모드로 동작하는 명령`,
	}

	grpcPort := 0
	grpcWebPort := 0
	useMock := false

	flags := serverCmd.Flags()
	flags.IntVar(&grpcPort, "port", 10980, "Grpc Listen Port")
	flags.IntVar(&grpcWebPort, "web-port", 10981, "Grpc-Web Listen Port")
	flags.BoolVar(&useMock, "mock", false, "Use Mock Controller")

	serverCmd.RunE = func(cmd *cobra.Command, args []string) error {
		credResolverPath, err := common.ResolvePathToAbs("~/.kubeconfig-updater-gui/cred-resolver-config.json")
		if err != nil {
			return err
		}
		aggrMetadataCachePath, err := common.ResolvePathToAbs("~/.kubeconfig-updater-gui/aggregated-cluster-metadata-cache.json")
		if err != nil {
			return err
		}
		app := &application.ServerApplication{}
		err = app.InitApplication(&application.ServerApplicationOption{
			CredResolverConfigPath:             credResolverPath,
			AggregatedClusterMetadataCachePath: aggrMetadataCachePath,

			UseMockController: useMock,
		})
		if err != nil {
			return err
		}
		fmt.Printf("Wait until server close...\n")
		app.StartApplication(grpcPort, grpcWebPort)
		<-app.ApplicationClose
		fmt.Printf("Server closed, exit process\n")
		return nil
	}

	return serverCmd
}
