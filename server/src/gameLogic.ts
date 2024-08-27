import { webusb } from "usb";
import { show } from "./shows";
import { ShowType, FullStateType, scoreboardStates } from "../sharedCopy";
import express, { Express, Request, Response } from "express";

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
	currentState: scoreboardStates.SCREEN_SAVER,
	currentPlayerBuzzedIn: -1,
	currentRoundIndex: -1,
	fullShowData: show,
	currentTimerPercentage: -1,
};

export const startGameLogic = (io: any, app: any) => {
	const maxTimeRemaining = 60 * 6; //10; //Ten minutes
	let timerRef: any = undefined;

	const handleBuzzer = (buttonData: any) => {
		if (currentState.currentPlayerBuzzedIn === -1) {
			console.log(buttonData);
			currentState.currentPlayerBuzzedIn = buttonData.whichController;
			io.emit("state", currentState);
		}
	};

	io.on("connection", (socket: any) => {
		console.log("Connected");
		socket.emit("state", currentState);
		socket.on("sendSound", (sound: string) => {
			console.log(`sound received ${sound}`);
			io.emit("demoSound", sound);
		});
		socket.on("resetActive", () => {
			currentState.currentPlayerBuzzedIn = -1;
			io.emit("state", currentState);
		});
		socket.on("newRoundState", (roundIndex: number) => {
			currentState.currentRoundIndex = roundIndex;
			currentState.currentState = scoreboardStates.SCREEN_SAVER;
			currentState.currentTimerValue = 0;
			currentState.currentTimerPercentage = 0;
			clearInterval(timerRef);
			io.emit("state", currentState);
		});
		socket.on("newShowState", (status: any) => {
			currentState.currentState = status;
			currentState.currentTimerValue = 0;
			currentState.currentTimerPercentage = 0;
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
		socket.on("startTimer", () => {
			currentState.currentTimerValue = maxTimeRemaining;
			currentState.currentTimerPercentage = 100;
			//currentState.currentState = scoreboardStates.IN_ROUND;
			//currentState.currentRoundIndex = roundIndex;
			io.emit("state", currentState);
			clearInterval(timerRef);
			timerRef = setInterval(() => {
				currentState.currentTimerValue--;
				currentState.currentTimerPercentage =
					(currentState.currentTimerValue / maxTimeRemaining) * 100;
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
			console.log("Unable to find USB; trying again");
			setTimeout(initiateIRReceiver, 1000);
		}
		if (device) {
			await device.open();
			await device.selectConfiguration(1);
			await device.claimInterface(DEVICE_INFO.interfaceId);

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

	app.get("/buzz/:controllerId", (req: Request, res: Response) => {
		console.log(`Request sent to buzz ${req.params.controllerId}`);
		if (currentState.currentPlayerBuzzedIn === -1) {
			const whichController = req.params.controllerId;
			if (whichController) {
				const ID = parseInt(whichController);
				if (!isNaN(ID) && ID >= 0 && ID <= 2) {
					currentState.currentPlayerBuzzedIn = ID;
					io.emit("state", currentState);
				}
			}
		}

		res.send(`Request sent to buzz ${req.params.controllerId}`);
	});

	//initiateIRReceiver();
};
