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
};

export type RoundType = {
	players: [PlayerType, PlayerType, PlayerType];
	minigame: string;
};

export type ShowType = {
	rounds: [RoundType, RoundType, RoundType];
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
	rounds: ShowType;
};
