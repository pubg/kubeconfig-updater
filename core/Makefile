GO_GRPC_OUT = "../backend/controller"
TS_GRPC_OUT = "../electron-app/src/renderer"

build-proto-go:
	protoc --go_out=$(GO_GRPC_OUT) --go_opt=paths=source_relative --go-grpc_out=$(GO_GRPC_OUT) --go-grpc_opt=paths=source_relative protos/*

build-proto-ts:
	protoc --grpc-web_out="import_style=typescript,mode=grpcweb:${TS_GRPC_OUT}" --js_out="import_style=commonjs:${TS_GRPC_OUT}" protos/*
