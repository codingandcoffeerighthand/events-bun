import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import { errHandler, notFoundHandler } from "../middleware/errHandler";

export class App {
	private app: express.Application;
	private _cleanup: () => void = () => { };
	constructor() {
		this.app = express();
		this.app.use(cors());
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
		this.app.use(compression());
		this.app.use(morgan("dev"));
		this.app.use(helmet());
	}

	addRouter(router: express.Router) {
		this.app.use(router);
	}

	addCleanup(cleanup: () => void) {
		this._cleanup = () => {
			this._cleanup;
			cleanup();
		};
	}

	start(port: number) {
		this.app.get("/", (req, res) => {
			res.send("Hello World!");
		})
		this.app.use(notFoundHandler, errHandler);
		const server = this.app.listen(port, () => {
			console.log(`Listening on port ${port}`);
		});
		process.on("SIGTERM", () => {
			this._cleanup();
			server.close();
		});
	}
}
