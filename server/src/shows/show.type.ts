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
	imagePath: string | null;
	soundIndex: number;
	score: number;
};

export type RoundType = {
	players: [PlayerType, PlayerType, PlayerType];
	minigame: string;
};

export type ShowType = [RoundType, RoundType, RoundType];
