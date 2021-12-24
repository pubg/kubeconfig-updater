module github.com/pubg/kubeconfig-updater/backend

go 1.17

require (
	github.com/Azure/azure-sdk-for-go v60.1.0+incompatible
	github.com/Azure/azure-sdk-for-go/sdk/azcore v0.20.1-0.20211215012433-e065f79cc2a6
	github.com/Azure/go-autorest/autorest v0.11.23
	github.com/Azure/go-autorest/autorest/azure/auth v0.5.3
	github.com/aws/aws-sdk-go-v2 v1.11.2
	github.com/aws/aws-sdk-go-v2/config v1.6.0
	github.com/aws/aws-sdk-go-v2/service/ec2 v1.25.0
	github.com/aws/aws-sdk-go-v2/service/eks v1.15.1
	github.com/ghodss/yaml v1.0.0
	github.com/improbable-eng/grpc-web v0.15.0
	github.com/mitchellh/mapstructure v1.4.3
	github.com/schollz/jsonstore v1.1.0
	github.com/spf13/cobra v1.2.1
	github.com/tencentcloud/tencentcloud-sdk-go/tencentcloud/common v1.0.228
	github.com/tencentcloud/tencentcloud-sdk-go/tencentcloud/cvm v1.0.313
	github.com/tencentcloud/tencentcloud-sdk-go/tencentcloud/tke v1.0.228
	github.com/tidwall/gjson v1.9.1
	github.krafton.com/xtrm/fox v1.1.1
	golang.org/x/crypto v0.0.0-20210921155107-089bfa567519 // indirect
	google.golang.org/grpc v1.38.0
	google.golang.org/protobuf v1.27.1
	gopkg.in/ini.v1 v1.62.0
	k8s.io/client-go v0.21.3
)

require (
	github.com/Azure/go-autorest v14.2.0+incompatible // indirect
	github.com/Azure/go-autorest/autorest/adal v0.9.14 // indirect
	github.com/Azure/go-autorest/autorest/azure/cli v0.4.2 // indirect
	github.com/Azure/go-autorest/autorest/date v0.3.0 // indirect
	github.com/Azure/go-autorest/autorest/to v0.4.0 // indirect
	github.com/Azure/go-autorest/autorest/validation v0.3.0 // indirect
	github.com/Azure/go-autorest/logger v0.2.1 // indirect
	github.com/Azure/go-autorest/tracing v0.6.0 // indirect
	github.com/aws/aws-sdk-go-v2/credentials v1.3.2 // indirect
	github.com/aws/aws-sdk-go-v2/feature/ec2/imds v1.4.0 // indirect
	github.com/aws/aws-sdk-go-v2/internal/configsources v1.1.2 // indirect
	github.com/aws/aws-sdk-go-v2/internal/endpoints/v2 v2.0.2 // indirect
	github.com/aws/aws-sdk-go-v2/internal/ini v1.2.0 // indirect
	github.com/aws/aws-sdk-go-v2/service/internal/presigned-url v1.5.2 // indirect
	github.com/aws/aws-sdk-go-v2/service/sso v1.3.2 // indirect
	github.com/aws/aws-sdk-go-v2/service/sts v1.6.1 // indirect
	github.com/aws/smithy-go v1.9.0 // indirect
	github.com/cenkalti/backoff/v4 v4.1.1 // indirect
	github.com/davecgh/go-spew v1.1.1 // indirect
	github.com/desertbit/timer v0.0.0-20180107155436-c41aec40b27f // indirect
	github.com/dimchansky/utfbom v1.1.0 // indirect
	github.com/form3tech-oss/jwt-go v3.2.2+incompatible // indirect
	github.com/gin-contrib/sse v0.1.0 // indirect
	github.com/gin-gonic/gin v1.7.4 // indirect
	github.com/go-logr/logr v0.4.0 // indirect
	github.com/go-playground/locales v0.14.0 // indirect
	github.com/go-playground/universal-translator v0.18.0 // indirect
	github.com/go-playground/validator/v10 v10.9.0 // indirect
	github.com/gogo/protobuf v1.3.2 // indirect
	github.com/golang/protobuf v1.5.2 // indirect
	github.com/google/go-cmp v0.5.6 // indirect
	github.com/google/gofuzz v1.1.0 // indirect
	github.com/imdario/mergo v0.3.5 // indirect
	github.com/inconshreveable/mousetrap v1.0.0 // indirect
	github.com/jmespath/go-jmespath v0.4.0 // indirect
	github.com/json-iterator/go v1.1.12 // indirect
	github.com/klauspost/compress v1.11.7 // indirect
	github.com/leodido/go-urn v1.2.1 // indirect
	github.com/mattn/go-isatty v0.0.14 // indirect
	github.com/mitchellh/go-homedir v1.1.0 // indirect
	github.com/modern-go/concurrent v0.0.0-20180306012644-bacd9c7ef1dd // indirect
	github.com/modern-go/reflect2 v1.0.2 // indirect
	github.com/rs/cors v1.7.0 // indirect
	github.com/spf13/pflag v1.0.5 // indirect
	github.com/tencentcloud/tencentcloud-sdk-go/tencentcloud/sts v1.0.319 // indirect
	github.com/tidwall/match v1.0.3 // indirect
	github.com/tidwall/pretty v1.2.0 // indirect
	github.com/tidwall/sjson v1.2.2 // indirect
	github.com/ugorji/go/codec v1.2.6 // indirect
	golang.org/x/net v0.0.0-20210805182204-aaa1db679c0d // indirect
	golang.org/x/oauth2 v0.0.0-20210402161424-2e8d93401602 // indirect
	golang.org/x/sys v0.0.0-20211007075335-d3039528d8ac // indirect
	golang.org/x/term v0.0.0-20210220032956-6a3ed077a48d // indirect
	golang.org/x/text v0.3.7 // indirect
	golang.org/x/time v0.0.0-20210220033141-f8bda1e9f3ba // indirect
	google.golang.org/appengine v1.6.7 // indirect
	google.golang.org/genproto v0.0.0-20210602131652-f16073e35f0c // indirect
	gopkg.in/inf.v0 v0.9.1 // indirect
	gopkg.in/yaml.v2 v2.4.0 // indirect
	k8s.io/apimachinery v0.21.3 // indirect
	k8s.io/klog/v2 v2.8.0 // indirect
	k8s.io/utils v0.0.0-20201110183641-67b214c5f920 // indirect
	nhooyr.io/websocket v1.8.6 // indirect
	sigs.k8s.io/structured-merge-diff/v4 v4.1.2 // indirect
	sigs.k8s.io/yaml v1.2.0 // indirect
)
