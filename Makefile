gen:
	@protoc --plugin=protoc-gen-ts_proto=./node_modules/.bin/protoc-gen-ts_proto.exe --ts_proto_out=./shared/proto/gen --ts_proto_opt=outputServices=grpc-js,outputClientImpl=grpc-js  --proto_path=./shared/proto ./shared/proto/event_service.proto
