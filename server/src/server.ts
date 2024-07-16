import * as http from "http";
import { startGameLogic } from "./gameLogic";
import { SERVER_PORT_NUM } from "../../shared";

const server = http.createServer((req, res) => {
	// Handle HTTP requests if needed
});

import { Server } from "socket.io";
const io = new Server(server, {
	cors: {
		origin: "http://localhost:3000",
	},
});

startGameLogic(io);

server.listen(SERVER_PORT_NUM, () => {
	console.log(`WebSocket server listening on port ${SERVER_PORT_NUM}`);
});
