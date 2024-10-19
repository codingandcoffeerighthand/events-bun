generate-proto-events-window:
	@protoc --plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts.exe --ts_opt=esModuleInterop=true --ts_out=./gen/ ./shared/proto/event_service.proto