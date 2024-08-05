import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
} from "react";
import { scoreboardStates } from "../sharedCopy";
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
	currentState: scoreboardStates;
	currentPlayerBuzzedIn: number;
	currentRoundIndex: number;
	fullShowData: ShowType;
	currentTimerPercentage: number;
};
interface AppContextInterface {
	startTimer: () => void;
	setRoundIndex: (newRound: number) => void;
	setCurrentShowState: (newState: string) => void;
	scoreChange: (scoreChangeValue: number, index: number) => void;
	gameState: FullStateType;
}

const AppContext = createContext<AppContextInterface>({
	gameState: {
		currentTimerValue: -1,
		currentState: scoreboardStates.SCREEN_SAVER,
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
	},
	setCurrentShowState: () => {},
	setRoundIndex: () => {},
	startTimer: () => {},
	scoreChange: () => {},
});

interface AppContextProviderProps {
	children?: React.ReactNode | React.ReactNode[];
}

export const AppContextProvider: React.FC<AppContextProviderProps> = ({
	children,
}) => {
	const [gameState, setGameState] = useState({
		currentTimerValue: -1,
		currentState: scoreboardStates.SCREEN_SAVER,
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

	useEffect(() => {
		function setFullState(newState: any) {
			setGameState(newState);
		}

		socket.on("state", setFullState);
	}, []);
	// socket.on("state", (value) => {
	// 	console.log(value);
	// 	setGameState(value);
	// });
	return (
		<AppContext.Provider
			value={{
				gameState,
				setCurrentShowState,
				setRoundIndex,
				startTimer,
				scoreChange,
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
