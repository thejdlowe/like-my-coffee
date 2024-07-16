import * as http from "http";
import { startGameLogic } from "./gameLogic";
import { PORT_NUM } from "../../shared";

const server = http.createServer((req, res) => {
	// Handle HTTP requests if needed
});

import { Server } from "socket.io";
const io = new Server(server);

startGameLogic(io);

server.listen(PORT_NUM, () => {
	console.log(`WebSocket server listening on port ${PORT_NUM}`);
});
