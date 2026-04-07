import { show } from "./shows";
import { FullStateType, scoreboardStates } from "../sharedCopy";
import express, { Request, Response } from "express";
import { WebSocketServer } from "ws";
const { exec } = require("child_process");

const whichControllerIsWhich = {
	PLAYER_ONE: 0,
	PLAYER_TWO: 1,
	PLAYER_THREE: 3,
	HOST: 2,
};

const currentState: FullStateType = {
	currentTimerValue: -1,
	currentScreenState: scoreboardStates.SCREEN_SAVER,
	currentPlayerBuzzedIn: -1,
	currentRoundIndex: -1,
	fullShowData: show,
	currentTimerPercentage: -1,
	hasStarted: false,
	usbReceiverConnectedStatus: false,
	controllerStatuses: [
		{ enabled: true, temperature: -1, battery: -1 },
		{ enabled: true, temperature: -1, battery: -1 },
		{ enabled: true, temperature: -1, battery: -1 },
	],
	bluetoothControllers: {},
};

interface ExtendedWebSocket extends WebSocket {
	isAlive: boolean;
	mac: string;
}

const picoList = new Map<string, ExtendedWebSocket>();

const sendToPico = (ws: ExtendedWebSocket, payload: any) => {
	if (ws.readyState === WebSocket.OPEN) {
		ws.send(JSON.stringify(payload));
	}
};

const broadcastToPicos = (payload: any) => {
	for (const ws of picoList.values()) {
		sendToPico(ws, payload);
	}
};

const setLights = (status: boolean) => {
	broadcastToPicos({ type: "setLights", status });
};

const getStatusFromPicos = () => {
	broadcastToPicos({ type: "status" });
};

const changeLightStatus = async (status: boolean) => {
	try {
		await fetch(`http://localhost:8080/${status}`);
	} catch (e) {}
};

export const startGameLogic = (io: any, app: any, wss: WebSocketServer) => {
	//const maxTimeRemaining = 60 * 12; //10;	//Ten minutes
	let currentMaxTimeRemaining = 0;
	let timerRef: any = undefined;

	const handleBuzzer = (buttonData: any) => {
		if (currentState.currentPlayerBuzzedIn === -1) {
			currentState.currentPlayerBuzzedIn = buttonData.whichController;
			io.emit("state", currentState);
			//changeLightStatus(false);
			setLights(false);
		}
	};

	wss.on("connection", (ws) => {
		console.log("Controller connected via WebSocket");
		const ews = ws as ExtendedWebSocket;
		ews.isAlive = true;
		ews.mac = "";

		// Give the Pico 5 seconds to send its identify message
		const identifyTimeout = setTimeout(() => {
			if (!ews.mac) {
				console.warn("[Pico] Connection never identified — closing");
				ews.close();
			}
		}, 5000);

		ws.on("message", (rawMessage: any) => {
			let msg: any = "";
			try {
				msg = JSON.parse(rawMessage.toString());
			} catch (e) {
				console.error("Invalid JSON from controller:", rawMessage);
				return;
			}
			console.log(msg);
			// Handle identification first
			if (msg.event === "identify") {
				console.log("Received identify message from controller:", msg);
				clearTimeout(identifyTimeout);
				const id = msg.mac; // e.g. "D8:3A:DD:76:3D:40"

				// Clean up any existing socket for this MAC
				picoList.get(id)?.close();
				picoList.set(id, ews);
				ews.mac = id;

				// Sync lock state now that we know who this is
				const isCurrentlyLocked =
					currentState.currentPlayerBuzzedIn !== -1 || !currentState.hasStarted;
				sendToPico(ews, { type: "setLights", status: true });

				currentState.bluetoothControllers[id] = {
					battery: "-1",
					temperature: "-1",
					status: "connected",
					color: msg.controller,
					lastUpdated: "N/A",
				};

				io.emit("state", currentState);
				return;
			} else if (msg.event === "status") {
				console.log("Received status update from Pico:", msg);
				const { mac, battery, temperature } = msg;
				if (currentState.bluetoothControllers[mac]) {
					currentState.bluetoothControllers[mac].battery = battery;
					currentState.bluetoothControllers[mac].temperature = temperature;
					currentState.bluetoothControllers[mac].lastUpdated =
						new Date().toLocaleTimeString();
				}
				io.emit("state", currentState);
			} else if (msg.event === "buzz") {
				if (currentState.currentPlayerBuzzedIn === -1) {
					setLights(false);

					enum buzzerButtons {
						GREEN = 0,
						RED = 1,
						YELLOW = 2,
					}
					const { mac, event, temperature, battery, controller } = msg;
					const whichControllerNumber = buzzerButtons[controller];
					currentState.currentPlayerBuzzedIn = parseInt(whichControllerNumber);
					if (currentState.bluetoothControllers[mac]) {
						currentState.bluetoothControllers[mac].lastUpdated =
							new Date().toLocaleTimeString();
					}

					io.emit("state", currentState);
				}
			}
		});

		ws.on("close", () => {
			console.log("Controller disconnected from WebSocket");
			const mac = ews.mac;
			if (currentState.bluetoothControllers[mac]) {
				delete currentState.bluetoothControllers[mac];
				io.emit("state", currentState);
			}
		});

		ws.on("error", (error) => {
			console.error("WebSocket error:", error);
		});
	});

	io.on("connection", (socket: any) => {
		console.log("Connected");
		socket.emit("state", currentState);
		socket.on("sendSound", (sound: string) => {
			io.emit("demoSound", sound);
		});
		socket.on("setAllLights", (lightStatus: boolean) => {
			//changeLightStatus(lightStatus);
			setLights(lightStatus);
		});
		socket.on("resetActive", () => {
			currentState.currentPlayerBuzzedIn = -1;
			io.emit("state", currentState);
		});
		socket.on("newRoundState", (roundIndex: number) => {
			currentState.currentRoundIndex = roundIndex;
			currentState.currentScreenState = scoreboardStates.SCREEN_SAVER;
			currentState.currentTimerValue = 0;
			currentState.currentTimerPercentage = 0;

			clearInterval(timerRef);
			io.emit("state", currentState);
		});
		socket.on("newShowState", (status: any) => {
			currentState.currentScreenState = status;
			currentState.currentTimerValue = 0;
			currentState.currentTimerPercentage = 0;
			currentState.hasStarted = false;
			clearInterval(timerRef);
			io.emit("state", currentState);
		});
		socket.on(
			"scoreChange",
			({
				scoreChangeValue,
				index,
			}: {
				scoreChangeValue: number;
				index: number;
			}) => {
				// console.log(
				// 	currentState.fullShowData.rounds[currentState.currentRoundIndex],
				// 	index
				// );
				currentState.fullShowData.rounds[
					currentState.currentRoundIndex
				].players[index].score += scoreChangeValue;
				currentState.currentPlayerBuzzedIn = -1;
				//changeLightStatus(true);
				setLights(true);
				io.emit("state", currentState);
			},
		);
		socket.on("winnerChange", ({ playerIndex }: { playerIndex: number }) => {
			// console.log(
			// 	currentState.fullShowData.rounds[currentState.currentRoundIndex],
			// 	playerIndex
			// );
			const state =
				!currentState.fullShowData.rounds[currentState.currentRoundIndex]
					.players[playerIndex].isWinner;
			currentState.fullShowData.rounds[currentState.currentRoundIndex].players[
				playerIndex
			].isWinner = state;
			if (state) {
				const finalRoundRoundIndex =
					currentState.fullShowData.rounds.length - 1;
				const whichColumn = currentState.currentRoundIndex;

				currentState.fullShowData.rounds[finalRoundRoundIndex].players[
					whichColumn
				].displayName =
					currentState.fullShowData.rounds[
						currentState.currentRoundIndex
					].players[playerIndex].displayName;

				currentState.fullShowData.rounds[finalRoundRoundIndex].players[
					whichColumn
				].pronouns =
					currentState.fullShowData.rounds[
						currentState.currentRoundIndex
					].players[playerIndex].pronouns;
			}
			io.emit("state", currentState);
		});
		socket.on("startTimer", () => {
			currentMaxTimeRemaining =
				currentState.fullShowData.rounds[currentState.currentRoundIndex]
					.timelength * 60;
			currentState.currentTimerValue = currentMaxTimeRemaining;
			currentState.currentTimerPercentage = 100;
			currentState.hasStarted = true;
			//changeLightStatus(true);
			setLights(true);
			io.emit("state", currentState);
			clearInterval(timerRef);
			timerRef = setInterval(() => {
				currentState.currentTimerValue--;
				currentState.currentTimerPercentage =
					(currentState.currentTimerValue / currentMaxTimeRemaining) * 100;
				if (currentState.currentTimerValue <= 0) {
					currentState.currentTimerValue = 0;
					currentState.currentTimerPercentage = 0;
					clearInterval(timerRef);
				}
				io.emit("state", currentState);
			}, 1000);
		});
	});

	app.get("/forcerebootnowdangit", (req: Request, res: Response) => {
		exec("sudo reboot", (error: any, stdout: any, stderr: any) => {
			if (error) {
				console.error(`Error restarting device: ${error}`);
				return;
			}
			console.log("Device restarting...");
			res.json({ message: "Updated" });
		});
		//console.log(jsonData);
	});

	app.get("/forceshutdownawwwman", (req: Request, res: Response) => {
		exec("sudo shutdown -h now", (error: any, stdout: any, stderr: any) => {
			if (error) {
				console.error(`Error restarting device: ${error}`);
				return;
			}
			console.log("Device shutting down...");
			res.json({ message: "Updated" });
		});
		//console.log(jsonData);
	});

	app.get("/updateControllerStatuses", (req: Request, res: Response) => {
		getStatusFromPicos();
		res.json({ message: "Updated" });
	});

	// app.post("/setupbluetooth", (req: Request, res: Response) => {
	// 	const jsonData: any = req.body;

	// 	const { macs } = jsonData;
	// 	macs.forEach((mac: string) => {
	// 		currentState.bluetoothControllers[mac] = {
	// 			status: "disconnected",
	// 			battery: "",
	// 			temperature: "",
	// 			color: "unknown",
	// 			lastUpdated: "N/A",
	// 		};
	// 	});
	// 	//console.log(jsonData);
	// 	res.json({ message: "Updated" });
	// });

	// app.post("/bluetooth", (req: Request, res: Response) => {
	// 	const jsonData: any = req.body;

	// 	const { mac, status, battery } = jsonData;
	// 	console.log(mac, status, battery);
	// 	if (currentState.bluetoothControllers[mac]) {
	// 		currentState.bluetoothControllers[mac].status = status;
	// 		currentState.bluetoothControllers[mac].battery = battery;
	// 	}
	// 	//console.log(jsonData);
	// 	res.json({ message: "Updated" });
	// });

	// app.post("/buzz/:controllerId", (req: Request, res: Response) => {
	// 	const jsonData: any = req.body;
	// 	const { batteryLevel, temperature, mac } = jsonData;
	// 	console.log(batteryLevel, temperature, mac);
	// 	console.log(`Request sent to buzz ${req.params.controllerId}`);
	// 	if (currentState.bluetoothControllers[mac]) {
	// 		currentState.bluetoothControllers[mac].battery = batteryLevel;
	// 		currentState.bluetoothControllers[mac].temperature = temperature;
	// 	}
	// 	if (currentState.currentPlayerBuzzedIn === -1) {
	// 		//changeLightStatus(false);
	// 		setLights(false);
	// 		const whichController = req.params.controllerId;
	// 		if (whichController) {
	// 			const ID = parseInt(whichController);
	// 			if (!isNaN(ID) && ID >= 0 && ID <= 2) {
	// 				currentState.currentPlayerBuzzedIn = ID;
	// 				currentState.controllerStatuses[ID].battery =
	// 					parseFloat(batteryLevel);
	// 				currentState.controllerStatuses[ID].temperature =
	// 					parseFloat(temperature);
	// 				/*if (req.params.powerPercentage) {
	// 						currentState.controllerStatuses[ID].powerPercentage = parseFloat(
	// 							req.params.powerPercentage
	// 						);
	// 					}*/
	// 				io.emit("state", currentState);
	// 			}
	// 		}
	// 	}

	// 	res.send(`Request sent to buzz ${req.params.controllerId}`);
	// });

	// app.get("/buzz/:controllerId", (req: Request, res: Response) => {
	// 	console.log(`Request sent to buzz ${req.params.controllerId}`);
	// 	if (currentState.currentPlayerBuzzedIn === -1) {
	// 		const whichController = req.params.controllerId;
	// 		if (whichController) {
	// 			const ID = parseInt(whichController);
	// 			if (!isNaN(ID) && ID >= 0 && ID <= 2) {
	// 				currentState.currentPlayerBuzzedIn = ID;
	// 				io.emit("state", currentState);
	// 			}
	// 		}
	// 	}

	// 	res.send(`Request sent to buzz ${req.params.controllerId}`);
	// });

	app.get("/status", (req: Request, res: Response) => {
		res.json(currentState);
	});

	//initiateIRReceiver();
};
