# Kubeconfig-Updater

This is GUI kuberentes config file manager app. It automatically resolve your cloud profiles and suggest registable clusters.

# Run Requirements
OS: Windows / Linux / MacOS

Arch: x86-64(amd64) / Arm64 

# Provided Artifact Type
Windows: Portable Zip, Installer

Linux: AppImage

MacOS: App(Zip), Dmg

# Config Store Path
Config stored under your HOME directory.
```
Windows: /Users/<username>/.kubeconfig-updater-gui
Linux: /home/<username>/.kubeconfig-updater-gui
MacOS: /Users/<username>/.kubeconfig-updater-gui
```

# Organization Customized Feature
This program will support organization specific customized options.
We are under discussion how to get policy file in organization.

Below is candidate get policy method. 
1. Get Policy from [MITM](https://en.wikipedia.org/wiki/Man-in-the-middle_attack) -able HTTP server. (Like public wifi web authentication)
2. Get Policy from predefined urls, locate in company's private network.
3. Publish Artifact with policy file.
   - Locate to installer inside
   - Locate to installer nearby

# Develop Requirements

### Frontend
1. Node.js 16 LTS
2. npm (or pnpm)

### Backend
3. Golang 1.17
4. goreleaser

# Application Architecture
![Screenshot](./docs/arch.png)

# Useful Commands

## Frontend

```commandline
# Init Project
cd electron-app
npm install
npm run start
```

## Backend

```commandline
# Build with goreleaser
cd backend
goreleaser build --rm-dist --snapshot

# Build with go mod (for develop)
cd backend
go build main.go -o kubeconfig-updater-backend

# AS API Server
kubeconfig-updater server --port=9080 --web-port=9081 --mock=false

# AS Standalone Cli
kubeconfig-updater register eks us-east-1 aws-test-cluster
kubeconfig-updater register aks my-rg azr-test-cluster
kubeconfig-updater register tke ap-hongkong tc-test-cluster
```

## Package
```commandline
# Full Packging
cd electron-app
make package-all

# Build Frontend and Package Only
cd electron-app
make package-only
```
