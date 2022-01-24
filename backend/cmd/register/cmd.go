package register

import (
	"fmt"

	"github.com/pubg/kubeconfig-updater/backend/pkg/raw_service/aws_service"
	"github.com/pubg/kubeconfig-updater/backend/pkg/raw_service/azure_service"
	"github.com/pubg/kubeconfig-updater/backend/pkg/raw_service/tencent_service"
	"github.com/spf13/cobra"
	tke "github.com/tencentcloud/tencentcloud-sdk-go/tencentcloud/tke/v20180525"
)

func Cmd() *cobra.Command {
	clusterCmd := &cobra.Command{
		Use:   "register",
		Short: "Register a Single Cluster",
		Long:  "",
	}

	clusterCmd.AddCommand(eksCommand())
	clusterCmd.AddCommand(aksCommand())
	clusterCmd.AddCommand(tkeCommand())

	return clusterCmd
}

func eksCommand() *cobra.Command {
	var eksCmd = &cobra.Command{
		Use:   "eks REGION CLUSTER-NAME",
		Short: "Register EKS Cluster",
		Long:  "",
		Args:  cobra.ExactValidArgs(2),
	}

	var awsProfile string
	var awsRole string
	eksCmd.Flags().StringVar(&awsProfile, "profile", "", "aws profile name to use. (if empty, use default credential chain)")
	eksCmd.Flags().StringVar(&awsRole, "role", "", "aws role name to use. (if empty, use iam user authentication)")

	eksCmd.RunE = func(cmd *cobra.Command, args []string) error {
		region := args[0]
		clusterName := args[1]
		err := aws_service.RegisterEks(clusterName, region, awsRole, awsProfile)
		if err != nil {
			return err
		}
		return nil
	}

	return eksCmd
}

func aksCommand() *cobra.Command {
	var aksCmd = &cobra.Command{
		Use:   "aks RESOURCE-GROUP CLUSTER-NAME",
		Short: "Register AKS Cluster",
		Long:  "",
		Args:  cobra.ExactValidArgs(2),
	}

	aksCmd.RunE = func(cmd *cobra.Command, args []string) error {
		resourceGroup := args[0]
		clusterName := args[1]
		// TODO: add profile support?
		return azure_service.RegisterAksCluster(resourceGroup, clusterName)
	}

	return aksCmd
}

func tkeCommand() *cobra.Command {
	var tkeCmd = &cobra.Command{
		Use:   "tke REGION CLUSTER-NAME",
		Short: "Register TKE Cluster",
		Long:  "",
		Args:  cobra.ExactValidArgs(2),
	}
	var tencentProfile string
	tkeCmd.Flags().StringVar(&tencentProfile, "profile", "default", "tencent profile name to use.")

	tkeCmd.RunE = func(cmd *cobra.Command, args []string) error {
		region := args[0]
		clusterName := args[1]
		clusters, err := tencent_service.ListTke(region, tencentProfile)
		if err != nil {
			return err
		}

		targetCluster := func() *tke.Cluster {
			for _, cluster := range clusters {
				if *cluster.ClusterName == clusterName {
					return cluster
				}
			}
			return nil
		}()

		if targetCluster == nil {
			return fmt.Errorf("can't find the clusterName(%s) in region(%s)", clusterName, region)
		}

		err = tencent_service.RegisterTkeCluster(region, *targetCluster.ClusterId, *targetCluster.ClusterName, tencentProfile)
		if err != nil {
			return err
		}

		return nil
	}
	return tkeCmd
}
