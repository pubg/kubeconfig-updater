package register

import (
	"fmt"

	"github.com/spf13/cobra"
	tke "github.com/tencentcloud/tencentcloud-sdk-go/tencentcloud/tke/v20180525"
	"github.krafton.com/xtrm/kubeconfig-updater/cmd/shared"
	"github.krafton.com/xtrm/kubeconfig-updater/internal/aks_helper"
	"github.krafton.com/xtrm/kubeconfig-updater/internal/eks_helper"
	"github.krafton.com/xtrm/kubeconfig-updater/internal/tke_helper"
)

func Cmd() *cobra.Command {
	clusterCmd := &cobra.Command{
		Use:   "register",
		Short: "단일 클러스터를 등록",
		Long:  "Short 설명을 봐주세요.",
	}

	clusterCmd.AddCommand(eksCommand())
	clusterCmd.AddCommand(aksCommand())
	clusterCmd.AddCommand(tkeCommand())

	return clusterCmd
}

func eksCommand() *cobra.Command {
	var eksCmd = &cobra.Command{
		Use:   "eks REGION CLUSTER-NAME",
		Short: "단일 EKS 클러스터 등록",
		Long:  ``,
		Args:  cobra.ExactValidArgs(2),
	}

	eksCmd.UsageTemplate()

	eksCmd.RunE = func(cmd *cobra.Command, args []string) error {
		region := args[0]
		clusterName := args[1]
		err := eks_helper.RegisterEksWithIamUser(clusterName, region, shared.GlobalAWSProfile)
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
		Short: "단일 AKS 클러스터 등록",
		Long:  ``,
		Args:  cobra.ExactValidArgs(2),
	}

	aksCmd.RunE = func(cmd *cobra.Command, args []string) error {
		resourceGroup := args[0]
		clusterName := args[1]
		// TODO: add profile support?
		return aks_helper.RegisterAksCluster(resourceGroup, clusterName)
	}

	return aksCmd
}

func tkeCommand() *cobra.Command {
	var tkeCmd = &cobra.Command{
		Use:   "tke REGION CLUSTER-NAME",
		Short: "단일 TKE 클러스터 등록",
		Long:  ``,
		Args:  cobra.ExactValidArgs(2),
	}
	tkeCmd.RunE = func(cmd *cobra.Command, args []string) error {
		var tencentProfile string
		if shared.GlobalTencentProfile != "" {
			tencentProfile = shared.GlobalTencentProfile
		}

		region := args[0]
		clusterName := args[1]
		clusters, err := tke_helper.ListTke(region, tencentProfile)
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

		err = tke_helper.RegisterTkeCluster(region, *targetCluster.ClusterId, *targetCluster.ClusterName, tencentProfile)
		if err != nil {
			return err
		}

		return nil
	}
	return tkeCmd
}
