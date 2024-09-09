import * as http from "http";
import express, { Express, Request, Response } from "express";
import cors from "cors";
import { startGameLogic } from "./gameLogic";
import { SERVER_PORT_NUM } from "../sharedCopy";

const app = express();
app.use(cors());

const server = http.createServer(app);

import { Server } from "socket.io";
const io = new Server(server, {
	cors: {
		origin: "*",
	},
});

startGameLogic(io, app);

server.listen(SERVER_PORT_NUM, () => {
	console.log(`WebSocket server listening on port ${SERVER_PORT_NUM}`);
});
