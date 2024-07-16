import { io } from "socket.io-client";

const URL = location.protocol + "//" + location.hostname + ":" + "3001";

export const socket = io(URL);
