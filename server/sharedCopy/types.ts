import { scoreboardStates } from "./consts";

export type OldPlayerType = {
	displayName: string;
	fullName: string;
	pronouns: "He/Him" | "She/Her" | "They/Them";
	sound: number;
};

export type OldRoundType = {
	players: [OldPlayerType, OldPlayerType, OldPlayerType];
	minigame: string;
};

export type OldShowType = {
	Round1: OldRoundType;
	Round2: OldRoundType;
	Round3: OldRoundType;
};

export type PlayerType = {
	displayName: string;
	pronouns: string;
	soundIndex: number;
	score: number;
	isWinner: boolean;
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

export type ControllerStatusType = {
	enabled: boolean;
	temperature: number;
	battery: number;
};

export type BluetoothControllerStatusType = {
	MAC: string;
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
	bluetoothControllers: { [key: string]: { status: string; battery: string } };
};
