# Kubeconfig-Updater

## Backend

### AS API Server
```commandline
kubeconfig-updater server --port=9080 --web-port=9081 --mock=false
```

### AS Standalone Cli
```commandline
kubeconfig-updater register eks us-east-1 aws-test-cluster
kubeconfig-updater register aks my-rg azr-test-cluster
kubeconfig-updater register tke ap-hongkong tc-test-cluster
```
