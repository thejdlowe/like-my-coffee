import * as http from "http";
import express, { Express, Request, Response } from "express";
import cors from "cors";
import { startGameLogic } from "./gameLogic";
import { WebSocketServer } from "ws";
import { SERVER_PORT_NUM } from "../sharedCopy";

const app = express();
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const server = http.createServer(app);

import { Server } from "socket.io";
const io = new Server(server, {
	cors: {
		origin: "*",
	},
});

const wss = new WebSocketServer({ server, path: "/controller" });

startGameLogic(io, app, wss);

server.listen(SERVER_PORT_NUM, () => {
	console.log(`WebSocket server listening on port ${SERVER_PORT_NUM}`);
});
