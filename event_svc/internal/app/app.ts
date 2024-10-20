import * as grpc from "@grpc/grpc-js";
import * as proto from "@shared/proto/gen/event_service";
export class GrpcServer {
	protected server: grpc.Server;
	constructor(eventService: proto.EventServiceServer, public addr: string) {
		this.server = new grpc.Server();
		this.server.addService(proto.EventServiceService, eventService);
	}

	start() {
		this.server.bindAsync(this.addr, grpc.ServerCredentials.createInsecure(), (err, port) => {
			console.log(`Event service running on ${port}`);
			if (err) {
				throw err;
			}
		});
	}
}
