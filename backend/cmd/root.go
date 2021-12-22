/*
Copyright © 2021 NAME HERE <EMAIL ADDRESS>

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
package cmd

import (
	"github.com/pubg/kubeconfig-updater/backend/cmd/register"
	"github.com/pubg/kubeconfig-updater/backend/cmd/server"
	"github.com/pubg/kubeconfig-updater/backend/internal/types"
	"github.com/spf13/cobra"
)

// RootCmd represents the base command when called without any subcommands
var RootCmd = &cobra.Command{
	Use:     "kubeconfig-updater",
	Version: types.VERSION,
	Short:   "EKS, AKS, TKE에 대한 접속 정보를 ~/.kube/config 파일에 등록할 수 있습니다",
	Long:    ``,
}

func init() {
	RootCmd.SetVersionTemplate("kubeconfig-updater: {{ .Version }}\n")
	RootCmd.AddCommand(server.Cmd())
	RootCmd.AddCommand(register.Cmd())
}

// Execute adds all child commands to the root command and sets flags appropriately.
// This is called by main.main(). It only needs to happen once to the RootCmd.
func Execute() {
	cobra.CheckErr(RootCmd.Execute())
}
