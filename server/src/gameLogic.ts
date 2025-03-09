import { webusb } from "usb";
import { show } from "./shows";
import { FullStateType, scoreboardStates } from "../sharedCopy";
import express, { Request, Response } from "express";

const DEVICE_INFO = {
	vendorId: 1118,
	productId: 672,
	interfaceId: 0,
	endpointId: 0,
};
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
		{ enabled: true, powerPercentage: -1 },
		{ enabled: true, powerPercentage: -1 },
		{ enabled: true, powerPercentage: -1 },
	],
	bluetoothControllers: {},
};

export const startGameLogic = (io: any, app: any, goodMacs: string[]) => {
	goodMacs.forEach((mac) => {
		currentState.bluetoothControllers[mac] = {
			status: "disconnected",
			battery: "",
		};
	});
	console.log(currentState);
	//const maxTimeRemaining = 60 * 12; //10;	//Ten minutes
	let currentMaxTimeRemaining = 0;
	let timerRef: any = undefined;

	const handleBuzzer = (buttonData: any) => {
		if (currentState.currentPlayerBuzzedIn === -1) {
			currentState.currentPlayerBuzzedIn = buttonData.whichController;
			io.emit("state", currentState);
		}
	};

	io.on("connection", (socket: any) => {
		console.log("Connected");
		socket.emit("state", currentState);
		socket.on("sendSound", (sound: string) => {
			io.emit("demoSound", sound);
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
				console.log(
					currentState.fullShowData.rounds[currentState.currentRoundIndex],
					index
				);
				currentState.fullShowData.rounds[
					currentState.currentRoundIndex
				].players[index].score += scoreChangeValue;
				currentState.currentPlayerBuzzedIn = -1;
				io.emit("state", currentState);
			}
		);
		socket.on("winnerChange", ({ playerIndex }: { playerIndex: number }) => {
			console.log(
				currentState.fullShowData.rounds[currentState.currentRoundIndex],
				playerIndex
			);
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

	const initiateIRReceiver = async () => {
		let device;
		try {
			device = await webusb.requestDevice({
				filters: [
					{ vendorId: DEVICE_INFO.vendorId, productId: DEVICE_INFO.productId },
				],
			});
		} catch (e) {
			currentState.usbReceiverConnectedStatus = false;
			console.log("Unable to find USB; trying again");
			setTimeout(initiateIRReceiver, 1000);
		}
		if (device) {
			await device.open();
			await device.selectConfiguration(1);
			await device.claimInterface(DEVICE_INFO.interfaceId);
			currentState.usbReceiverConnectedStatus = true;

			while (true) {
				let result = await device.transferIn(1, 5);
				if (result.data && result.data.byteLength === 5) {
					const dataView = new Uint8Array(result.data.buffer);
					const whichControllerReal = dataView[2];
					let whichController = -1;
					if (whichControllerReal === whichControllerIsWhich.PLAYER_ONE) {
						whichController = 0;
					}
					if (whichControllerReal === whichControllerIsWhich.PLAYER_TWO) {
						whichController = 1;
					}
					if (whichControllerReal === whichControllerIsWhich.PLAYER_THREE) {
						whichController = 2;
					}
					const buttonsPressed = dataView[4];
					const altButtonsPressed = dataView[3];
					const startButton = !!(altButtonsPressed & 0x10);
					const backButton = !!(altButtonsPressed & 0x20);
					const XboxButton = !!(buttonsPressed & 0x04);
					const bigButton = !!(buttonsPressed & 0x08);
					const AButton = !!(buttonsPressed & 0x10);
					const BButton = !!(buttonsPressed & 0x20);
					const XButton = !!(buttonsPressed & 0x40);
					const YButton = !!(buttonsPressed & 0x80);
					handleBuzzer({
						whichController,
						startButton,
						backButton,
						XboxButton,
						bigButton,
						AButton,
						BButton,
						XButton,
						YButton,
					});
				}
			}
		}
	};

	app.post("/bluetooth", (req: Request, res: Response) => {
		const jsonData: any = req.body;

		const { mac, status, battery } = jsonData;
		console.log(mac, status, battery)
		if (currentState.bluetoothControllers[mac]) {
			currentState.bluetoothControllers[mac].status = status;
			currentState.bluetoothControllers[mac].battery = battery;
		}
		//console.log(jsonData);
		res.json({ message: "Updated" });
	});

	app.get(
		"/buzz/:controllerId/:powerPercentage?",
		(req: Request, res: Response) => {
			console.log(
				`Request sent to buzz ${req.params.controllerId} with power level ${req.params.powerPercentage}`
			);
			if (currentState.currentPlayerBuzzedIn === -1) {
				const whichController = req.params.controllerId;
				if (whichController) {
					const ID = parseInt(whichController);
					if (!isNaN(ID) && ID >= 0 && ID <= 2) {
						currentState.currentPlayerBuzzedIn = ID;
						if (req.params.powerPercentage) {
							currentState.controllerStatuses[ID].powerPercentage = parseFloat(
								req.params.powerPercentage
							);
						}
						io.emit("state", currentState);
					}
				}
			}

			res.send(`Request sent to buzz ${req.params.controllerId}`);
		}
	);

	app.get("/status", (req: Request, res: Response) => {
		//console.log("Update requested");
		res.json(currentState);
	});

	initiateIRReceiver();
};
