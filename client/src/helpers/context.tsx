import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
} from "react";
import { scoreboardStates } from "../sharedCopy";
import { useSounds } from "./sounds";
// import { FullStateType } from "../../../shared/types";
// import { scoreboardStates } from "../../../shared/consts";

import { useNavigate, useLocation } from "react-router-dom";
import { socket } from "./socket";

export type PlayerType = {
	displayName: string;
	pronouns: string;
	soundIndex: number;
	score: number;
};

export type RoundType = {
	players: [PlayerType, PlayerType, PlayerType];
	minigame: string;
};

export type ShowType = {
	rounds: RoundType[];
	images: string[];
	logo: string;
	apply: string;
	social: string;
};

export type FullStateType = {
	currentTimerValue: number;
	currentScreenState: scoreboardStates;
	currentPlayerBuzzedIn: number;
	currentRoundIndex: number;
	fullShowData: ShowType;
	currentTimerPercentage: number;
	hasStarted: boolean;
};
interface AppContextInterface {
	startTimer: () => void;
	setRoundIndex: (newRound: number) => void;
	setDemoSound: (sound: string) => void;
	setCurrentShowState: (newState: string) => void;
	scoreChange: (scoreChangeValue: number, index: number) => void;
	serverState: FullStateType;
	currentTimerValue: number;
	currentPlayerBuzzedIn: number;
	currentTimerPercentage: number;
	currentRoundIndex: number;
	currentScreenState: scoreboardStates;
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
	},
	setCurrentShowState: () => {},
	setRoundIndex: () => {},
	startTimer: () => {},
	scoreChange: () => {},
	setDemoSound: () => {},
	currentTimerValue: -1,
	currentPlayerBuzzedIn: -1,
	currentTimerPercentage: -1,
	currentRoundIndex: -1,
	currentScreenState: scoreboardStates.SCREEN_SAVER,
});

interface AppContextProviderProps {
	children?: React.ReactNode | React.ReactNode[];
}

export const AppContextProvider: React.FC<AppContextProviderProps> = ({
	children,
}) => {
	const location = useLocation();
	const { pathname } = location;
	const { allSoundsObject, gameSoundsArr, stop } = useSounds();

	const [currentTimerValue, setCurrentTimerValue] = useState(-1);
	const [currentScreenState, setCurrentScreenState] = useState(
		scoreboardStates.SCREEN_SAVER
	);
	const [currentPlayerBuzzedIn, setCurrentPlayerBuzzedIn] = useState(-1);
	const [currentRoundIndex, setCurrentRoundIndex] = useState(-1);
	const [currentTimerPercentage, setCurrentTimerPercentage] = useState(-1);
	const [hasRoundStarted, setHasRoundStarted] = useState(false);

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

	const setDemoSound = useCallback((sound: string) => {
		socket.emit("sendSound", sound);
	}, []);

	useEffect(() => {
		function setFullState(newState: FullStateType) {
			setGameState(newState as any);
			console.log(newState);
			setCurrentTimerValue(newState.currentTimerValue);
			setCurrentPlayerBuzzedIn(newState.currentPlayerBuzzedIn);
			setCurrentTimerPercentage(newState.currentTimerPercentage);
			setCurrentRoundIndex(newState.currentRoundIndex);
			setCurrentScreenState(newState.currentScreenState);
			setHasRoundStarted(newState.hasStarted);
		}

		function demoSound(soundToPlay: string) {
			if (allSoundsObject[soundToPlay as keyof typeof allSoundsObject]) {
				allSoundsObject[soundToPlay as keyof typeof allSoundsObject]();
			}
		}

		socket.on("state", setFullState);

		pathname === "/" && socket.on("demoSound", demoSound);
	}, []);

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
						//console.log(currentPlayerBuzzedIn)
						const whichSound = currentPlayerBuzzedIn + currentRoundIndex * 3;
						//console.log(whichSound);
						if (gameSoundsArr[whichSound]) {
							gameSoundsArr[whichSound]();
						}
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
				setDemoSound,
				currentTimerValue,
				currentPlayerBuzzedIn,
				currentTimerPercentage,
				currentRoundIndex,
				currentScreenState,
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
