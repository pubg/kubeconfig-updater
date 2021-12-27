#!/bin/bash

VERSION=$1
ROOT_PWD="$PWD"

if [ -z "$VERSION" ]; then
  echo "version is not defined. please pass valid semver"
  exit 1
fi

echo "CURRENT VERSION: $VERSION"

# change electron-app package.json version
OUTPUT=$(cd "$ROOT_PWD/electron-app" && pnpm version "$VERSION")
echo "electron-app version: $OUTPUT"

## change electron-app/release
OUTPUT=$(cd "$ROOT_PWD/electron-app/release/app" && pnpm version "$VERSION")
echo "electron-app/release version: $OUTPUT"
