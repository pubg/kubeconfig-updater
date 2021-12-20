#!/bin/bash

# Requirements
## protoc, grpc-web
## https://github.com/grpc/grpc-web/releases

# set -eux

SRC_PATH="./protos"
OUTPUT_PATH="./../electron-app/src/renderer"

rm -rf "$OUTPUT_PATH/protos"
mkdir "$OUTPUT_PATH/protos"

protoc "$SRC_PATH/common.proto" "$SRC_PATH/kubeconfig_service.proto" -I="./core"  --grpc_web_out="import_style=typescript,mode=grpcweb:$OUTPUT_PATH" --js_out="import_style=commonjs:$OUTPUT_PATH"
