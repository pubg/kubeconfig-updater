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
	origin := ""
	configPath := ""

	flags := serverCmd.Flags()
	flags.IntVar(&grpcPort, "port", 10980, "Grpc Listen Port")
	flags.IntVar(&grpcWebPort, "web-port", 10981, "Grpc-Web Listen Port")
	flags.StringVar(&origin, "origin-url", "http://localhost:1212", "origin url for CORS")
	flags.BoolVar(&useMock, "mock", false, "Use Mock Controller")
	flags.StringVar(&configPath, "config", "~/.kubeconfig-updater-gui/config.yaml", "Application config path (yaml and json support)")

	serverCmd.RunE = func(cmd *cobra.Command, args []string) error {
		absConfigPath, err := common.ResolvePathToAbs(configPath)
		if err != nil {
			fmt.Printf("Error occurred while normalize config path, path:%s\n", configPath)
			return err
		}

		app := &application.ServerApplication{}
		err = app.InitApplication(&application.ServerApplicationOption{
			GrpcPort:          grpcPort,
			GrpcWebPort:       grpcWebPort,
			ConfigPath:        absConfigPath,
			UseMockController: useMock,
			Origin:            origin,
		})
		if err != nil {
			return err
		}
		fmt.Printf("Wait until server close...\n")
		app.StartApplication()
		<-app.ApplicationClose
		fmt.Printf("Server closed, exit process\n")
		return nil
	}

	return serverCmd
}
