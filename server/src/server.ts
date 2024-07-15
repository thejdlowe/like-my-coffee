// server/server.js

//const http = require("http");
import * as http from "http";
//import { startGameLogic } from "./gameLogic.ts";
import { startGameLogic } from "./gameLogic";

const server = http.createServer((req, res) => {
	// Handle HTTP requests if needed
});

import { Server } from "socket.io";
const io = new Server(server);

startGameLogic(io);

server.listen(3001, () => {
	console.log("WebSocket server listening on port 3001");
});
