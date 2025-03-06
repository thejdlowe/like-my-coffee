import { scoreboardStates } from "./consts";

export type PlayerType = {
	displayName: string;
	pronouns: string;
	soundIndex: number;
	score: number;
	isWinner: boolean;
};

export type ControllerStatusType = {
	enabled: boolean;
	powerPercentage: number;
};

export type RoundType = {
	players: [PlayerType, PlayerType, PlayerType];
	minigame: string;
	example: string;
	timelength: number;
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
	usbReceiverConnectedStatus: boolean;
	controllerStatuses: ControllerStatusType[];
};
