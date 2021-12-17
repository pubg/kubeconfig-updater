build-backend:
	cd ../backend && goreleaser build --rm-dist --snapshot

copy-backend-to-package:
	mkdir -p release/app/bin
	cp ../backend/dist/kubeconfig-updater_darwin_amd64/kubeconfig-updater-backend release/app/bin/kubeconfig-updater-backend-mac-x64
	cp ../backend/dist/kubeconfig-updater_darwin_arm64/kubeconfig-updater-backend release/app/bin/kubeconfig-updater-backend-mac-arm64
	cp ../backend/dist/kubeconfig-updater_linux_amd64/kubeconfig-updater-backend release/app/bin/kubeconfig-updater-backend-linux-x64
	cp ../backend/dist/kubeconfig-updater_linux_arm64/kubeconfig-updater-backend release/app/bin/kubeconfig-updater-backend-linux-arm64
	cp ../backend/dist/kubeconfig-updater_windows_amd64/kubeconfig-updater-backend.exe release/app/bin/kubeconfig-updater-backend-win-x64.exe
	cp ../backend/dist/kubeconfig-updater_windows_arm64/kubeconfig-updater-backend.exe release/app/bin/kubeconfig-updater-backend-win-arm64.exe

package-only:
	npm run package:only

package-all: build-backend copy-backend-to-package
	npm run clean:dist
	npm run build
	npm run package:only:allplatform

publish:
	gh release create v0.0.2 --prerelease --title=Kubeconfig-Updater-GUI ./release/build/*.exe ./release/build/*.dmg ./release/build/*.zip ./release/build/*.AppImage
