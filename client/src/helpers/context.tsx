import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
} from "react";
import {
	scoreboardStates,
	FullStateType,
	ControllerStatusType,
} from "../sharedCopy";
import { useSounds } from "./sounds";
import { useLocation } from "react-router-dom";
import { socket, heartBeatURL } from "./socket";

interface AppContextInterface {
	startTimer: () => void;
	setRoundIndex: (newRound: number) => void;
	setDemoSound: (sound: string) => void;
	setCurrentShowState: (newState: string) => void;
	scoreChange: (scoreChangeValue: number, index: number) => void;
	winnerChange: (playerIndex: number) => void;
	serverState: FullStateType;
	currentTimerValue: number;
	currentPlayerBuzzedIn: number;
	currentTimerPercentage: number;
	currentRoundIndex: number;
	currentScreenState: scoreboardStates;
	currentUsbReceiverConnectedStatus: boolean;
	bluetoothControllers: { [key: string]: { status: string; battery: string } };
}

const AppContext = createContext<AppContextInterface>({
	serverState: {
		currentTimerValue: -1,
		currentScreenState: scoreboardStates.SCREEN_SAVER,
		currentPlayerBuzzedIn: -1,
		currentRoundIndex: -1,
		fullShowData: {
			images: [],
			logo: "",
			apply: "",
			social: "",
			rounds: [],
		},
		currentTimerPercentage: -1,
		hasStarted: false,
		usbReceiverConnectedStatus: false,
		controllerStatuses: [
			{ enabled: true, powerPercentage: -1 },
			{ enabled: true, powerPercentage: -1 },
			{ enabled: true, powerPercentage: -1 },
		],
		bluetoothControllers: {},
	},
	setCurrentShowState: () => {},
	setRoundIndex: () => {},
	startTimer: () => {},
	scoreChange: () => {},
	winnerChange: () => {},
	setDemoSound: () => {},
	currentTimerValue: -1,
	currentPlayerBuzzedIn: -1,
	currentTimerPercentage: -1,
	currentRoundIndex: -1,
	currentScreenState: scoreboardStates.SCREEN_SAVER,
	currentUsbReceiverConnectedStatus: false,
	bluetoothControllers: {},
});

interface AppContextProviderProps {
	children?: React.ReactNode | React.ReactNode[];
}

export const AppContextProvider: React.FC<AppContextProviderProps> = ({
	children,
}) => {
	const location = useLocation();
	const { pathname } = location;
	const { allSoundsObject, gameSoundsArr } = useSounds();

	const [currentTimerValue, setCurrentTimerValue] = useState(-1);
	const [currentScreenState, setCurrentScreenState] = useState(
		scoreboardStates.SCREEN_SAVER
	);
	const [currentPlayerBuzzedIn, setCurrentPlayerBuzzedIn] = useState(-1);
	const [currentRoundIndex, setCurrentRoundIndex] = useState(-1);
	const [currentTimerPercentage, setCurrentTimerPercentage] = useState(-1);
	const [hasRoundStarted, setHasRoundStarted] = useState(false);
	const [
		currentUsbReceiverConnectedStatus,
		setCurrentUsbReceiverConnectedStatus,
	] = useState(false);
	const [controllerStatuses, setControllerStatuses] = useState([
		{ enabled: true, powerPercentage: -1 },
		{ enabled: true, powerPercentage: -1 },
		{ enabled: true, powerPercentage: -1 },
	]);
	const [bluetoothControllers, setBluetoothControllers] = useState({});

	const [gameState, setGameState] = useState({
		currentTimerValue: -1,
		currentScreenState: scoreboardStates.SCREEN_SAVER,
		currentPlayerBuzzedIn: -1,
		currentRoundIndex: -1,
		fullShowData: {
			images: [],
			logo: "",
			apply: "",
			social: "",
			rounds: [],
		},
		currentTimerPercentage: -1,
		hasStarted: false,
		usbReceiverConnectedStatus: false,
		controllerStatuses: [
			{ enabled: true, powerPercentage: -1 },
			{ enabled: true, powerPercentage: -1 },
			{ enabled: true, powerPercentage: -1 },
		],
		bluetoothControllers: {},
	});

	const setCurrentShowState = useCallback((newState: string) => {
		socket.emit("newShowState", newState);
	}, []);

	const setRoundIndex = useCallback((newRound: number) => {
		socket.emit("newRoundState", newRound);
	}, []);

	const startTimer = useCallback(() => {
		socket.emit("startTimer");
	}, []);

	const scoreChange = useCallback((scoreChangeValue: number, index: number) => {
		socket.emit("scoreChange", { scoreChangeValue, index });
	}, []);

	const winnerChange = useCallback((playerIndex: number) => {
		socket.emit("winnerChange", { playerIndex });
	}, []);

	const setDemoSound = useCallback((sound: string) => {
		socket.emit("sendSound", sound);
	}, []);

	const newSetFullState = useCallback(
		(newState: FullStateType) => {
			if (JSON.stringify(newState) !== JSON.stringify(gameState)) {
				setGameState(newState as any);

				setCurrentTimerValue(newState.currentTimerValue);
				setCurrentPlayerBuzzedIn(newState.currentPlayerBuzzedIn);
				setCurrentTimerPercentage(newState.currentTimerPercentage);
				setCurrentRoundIndex(newState.currentRoundIndex);
				setCurrentScreenState(newState.currentScreenState);
				setHasRoundStarted(newState.hasStarted);
				setCurrentUsbReceiverConnectedStatus(
					newState.usbReceiverConnectedStatus
				);
				setBluetoothControllers(newState.bluetoothControllers);
			}
		},
		[
			gameState,
			setGameState,
			setCurrentTimerValue,
			setCurrentPlayerBuzzedIn,
			setCurrentTimerPercentage,
			setCurrentRoundIndex,
			setCurrentScreenState,
			setHasRoundStarted,
			setCurrentUsbReceiverConnectedStatus,
		]
	);

	useEffect(() => {
		function demoSound(soundToPlay: string) {
			if (allSoundsObject[soundToPlay as keyof typeof allSoundsObject]) {
				allSoundsObject[soundToPlay as keyof typeof allSoundsObject]();
			}
		}

		const heartbeat = setInterval(() => {
			try {
				fetch(heartBeatURL)
					.then((data) => data.json())
					.then((obj) => {
						newSetFullState(obj);
					})
					.catch((err) => {
						console.log(err);
					});
			} catch (e) {}
		}, 250);

		pathname === "/" && socket.on("demoSound", demoSound);

		return () => clearInterval(heartbeat);
	}, [gameState]);

	useEffect(() => {
		if (pathname === "/") {
			if (currentTimerPercentage === 100) {
				if (hasRoundStarted === true) {
					allSoundsObject.intro();
				}
			} else if (currentTimerPercentage === 0) {
				if (hasRoundStarted === true) {
					allSoundsObject.outro();
				}
			}
		}
	}, [currentTimerPercentage, pathname, hasRoundStarted]);

	useEffect(() => {
		if (pathname === "/") {
			if (currentScreenState === scoreboardStates.IN_ROUND) {
				if (currentRoundIndex !== -1) {
					if (currentPlayerBuzzedIn !== -1) {
						const whichSound = currentPlayerBuzzedIn + currentRoundIndex * 3;
						if (gameSoundsArr[whichSound]) {
							gameSoundsArr[whichSound]();
						}
					} else {
						allSoundsObject.ready();
					}
				}
			}
		}
	}, [pathname, currentPlayerBuzzedIn, currentRoundIndex, currentScreenState]);

	return (
		<AppContext.Provider
			value={{
				serverState: gameState,
				setCurrentShowState,
				setRoundIndex,
				startTimer,
				scoreChange,
				winnerChange,
				setDemoSound,
				currentTimerValue,
				currentPlayerBuzzedIn,
				currentTimerPercentage,
				currentRoundIndex,
				currentScreenState,
				currentUsbReceiverConnectedStatus,
				bluetoothControllers,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};

export const useAppContext = () => {
	const value = useContext(AppContext);
	return value;
};
