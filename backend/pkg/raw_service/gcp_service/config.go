package gcp_service

import (
	"bytes"
	"encoding/json"
	"fmt"
	"os/exec"
)

type Configs []Config

type Config struct {
	IsActive   bool   `json:"is_active"`
	Name       string `json:"name"`
	Properties struct {
		Core struct {
			Project                       *string `json:"project"`
			Account                       *string `json:"account"`
			CustomCaCertsFile             *string `json:"custom_ca_certs_file"`
			DefaultRegionalBackendService *string `json:"default_regional_backend_service"`
			DisableColor                  *string `json:"disable_color"`
			DisableFileLogging            *string `json:"disable_file_logging"`
			DisableUsageReporting         *string `json:"disable_usage_reporting"`
			LogHttp                       *string `json:"log_http"`
			MaxLogDays                    *string `json:"MaxLogDays"`
			PassCredentialsToGsutil       *string `json:"pass_credentials_to_gsutil"`
			ShowStructuredLogs            *string `json:"show_structured_logs"`
			TraceToken                    *string `json:"trace_token"`
			UserOutputEnabled             *string `json:"user_output_enabled"`
			Verbosity                     *string `json:"verbosity"`
		} `json:"core"`
		Accessibility struct {
			ScreenReader *string `json:"screen_reader"`
		} `json:"accessibility"`
		App struct {
			CloudBuildTimeout   *string `json:"cloud_build_timeout"`
			PromoteByDefault    *string `json:"promote_by_default"`
			StopPreviousVersion *string `json:"stop_previous_version"`
			UseRuntimeBuilders  *string `json:"use_runtime_builders"`
		} `json:"app"`
		Artifacts struct {
			DisableCredentials        *string `json:"disable_credentials"`
			ImpersonateServiceAccount *string `json:"impersonate_service_account"`
		} `json:"artifacts"`
		Auth struct {
			Location   *string `json:"location"`
			Repository *string `json:"repository"`
		} `json:"auth"`
		Billing struct {
			QuotaProject *string `json:"quota_project"`
		} `json:"billing"`
		Builds struct {
			UseKaniko      *string `json:"use_kaniko"`
			KanikoCacheTTL *string `json:"kaniko_cache_ttl"`
			Timeout        *string `json:"timeout"`
		} `json:"builds"`
		ComponentManager struct {
			AdditionalRepositories *string `json:"additional_repositories"`
			DisableUpdateCheck     *string `json:"disable_update_check"`
		} `json:"component_manager"`
		Composer struct {
			Location           *string `json:"location"`
			DisableUpdateCheck *string `json:"disable_update_check"`
		} `json:"composer"`
		Compute struct {
			Region                     *string `json:"region"`
			Zone                       *string `json:"zone"`
			UseNewListUsableSubnetsAPI *string `json:"use_new_list_usable_subnets_api"`
		} `json:"compute"`
		Container struct {
			BuildTimeout                     *string `json:"build_timeout"`
			Cluster                          *string `json:"cluster"`
			UseApplicationDefaultCredentials *string `json:"use_application_default_credentials"`
			UseClientCertificate             *string `json:"use_client_certificate"`
		} `json:"container"`
		ContextAware struct {
			UseClientCertificate *string `json:"use_client_certificate"`
		} `json:"context_aware"`
		Dataflow struct {
			DisablePublicIPs *string `json:"disable_public_ips"`
			PrintOnly        *string `json:"print_only"`
		} `json:"dataflow"`
		Datafusion struct {
			Location *string `json:"location"`
		} `json:"datafusion"`
		Dataproc struct {
			Region *string `json:"region"`
		} `json:"dataproc"`
		DeploymentManager struct {
			GlobImports *string `json:"glob_imports"`
		} `json:"deployment_manager"`
		Filestore struct {
			Zone *string `json:"zone"`
		} `json:"filestore"`
		Functions struct {
			Region *string `json:"region"`
		} `json:"functions"`
		GameServices struct {
			DefaultDeployment *string `json:"default_deployment"`
			DefaultRealm      *string `json:"default_realm"`
			Location          *string `json:"location"`
		} `json:"game_services"`
		GCloudignore struct {
			Enabled *string `json:"enabled"`
		} `json:"functions"`
		Healthcare struct {
			Dataset  *string `json:"dataset"`
			Location *string `json:"location"`
		} `json:"healthcare"`
		Lifesciences struct {
			Location *string `json:"location"`
		} `json:"lifesciences"`
		MLEngine struct {
			LocalPython     *string `json:"local_python"`
			PollingInterval *string `json:"polling_interval"`
		} `json:"ml_engine"`
		Proxy struct {
			Address  *string `json:"address"`
			Password *string `json:"password"`
			Port     *string `json:"port"`
			Rdns     *string `json:"rdns"`
			Type     *string `json:"type"`
			Username *string `json:"username"`
		} `json:"proxy"`
		Redis struct {
			Region *string `json:"region"`
		} `json:"redis"`
		Run struct {
			Cluster         *string `json:"cluster"`
			ClusterLocation *string `json:"cluster_location"`
			Platform        *string `json:"platform"`
			Region          *string `json:"region"`
		} `json:"run"`
		SCC struct {
			Organization *string `json:"organization"`
		} `json:"scc"`
		Secrets struct {
			Locations         *string `json:"locations"`
			ReplicationPolicy *string `json:"replication-policy"`
		} `json:"secrets"`
		Spanner struct {
			Instance *string `json:"instance"`
		} `json:"spanner"`
		Survey struct {
			DisablePrompts *string `json:"disable_prompts"`
		} `json:"survey"`
	} `json:"properties"`
}

func GetConfigs() (Configs, error) {

	var stdout, stderr bytes.Buffer

	exe, err := exec.LookPath("gcloud")
	if err != nil {
		return nil, fmt.Errorf("glcoud not on path")
	}

	cmd := exec.Command(exe, "config", "configurations", "list", "--format", "json")

	cmd.Stdout = &stdout
	cmd.Stderr = &stderr
	err = cmd.Run()
	if err != nil {
		return nil, fmt.Errorf("Command %s failed with %s (%s)\n", cmd.String(), err, string(stderr.Bytes()))
	}

	var configs Configs
	err = json.Unmarshal(stdout.Bytes(), &configs)
	if err != nil {
		return nil, fmt.Errorf("failed to parse json output of %s into configuration, %s\n", cmd.String(), err)
	}

	return configs, nil
}
