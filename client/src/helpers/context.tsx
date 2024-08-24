import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
} from "react";
import { scoreboardStates } from "../sharedCopy";
import useSound from "use-sound";
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

const SOUND_URL = "/sounds/all sound effects.mp3";

export const AppContextProvider: React.FC<AppContextProviderProps> = ({
	children,
}) => {
	const location = useLocation();
	const { pathname } = location;
	const [play, { stop }] = useSound(SOUND_URL, {
		sprite: {
			intro: [0, 3366],
			outro: [3970, 7328 - 3970],
			donkeykong: [7817, 8449 - 7817],
			pacman: [8450, 8991 - 8450],
			link: [8996, 9467 - 8996],
			candycrush: [9510, 10374 - 9510],
			aol: [10643, 11153 - 10643],
			digdug: [11185, 11665 - 11185],
			discord: [11812, 12163 - 11812],
			jeopardy: [12309, 12900 - 12309],
			metalgearsolid: [12966, 14315 - 12966],
		},
	});

	const intro = () => play({ id: "intro" }),
		outro = () => play({ id: "outro" }),
		donkeykong = () => play({ id: "donkeykong" }),
		pacman = () => play({ id: "pacman" }),
		link = () => play({ id: "link" }),
		candycrush = () => play({ id: "candycrush" }),
		aol = () => play({ id: "aol" }),
		digdug = () => play({ id: "digdug" }),
		discord = () => play({ id: "discord" }),
		jeopardy = () => play({ id: "jeopardy" }),
		metalgearsolid = () => play({ id: "metalgearsolid" });

	const allSoundsObject = {
		intro: intro,
		outro: outro,
		donkeykong: donkeykong,
		pacman: pacman,
		link: link,
		candycrush: candycrush,
		aol: aol,
		digdug: digdug,
		discord: discord,
		jeopardy: jeopardy,
		metalgearsolid: metalgearsolid,
	};

	const gameSounds = [
		donkeykong,
		pacman,
		link,
		candycrush,
		aol,
		digdug,
		discord,
		jeopardy,
		metalgearsolid,
	];

	useEffect(() => {
		//play({ id: "metalgearsolid" });
	}, [play]);

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

		function demoSound(soundToPlay: string) {
			if (allSoundsObject[soundToPlay as keyof typeof allSoundsObject]) {
				allSoundsObject[soundToPlay as keyof typeof allSoundsObject]();
			}
		}

		socket.on("state", setFullState);

		pathname === "/" && socket.on("demoSound", demoSound);
	}, []);
	
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
