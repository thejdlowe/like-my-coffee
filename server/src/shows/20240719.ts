import { ShowType } from "./show.type";
import { playerImages } from "../../../shared";

export const show: ShowType = [
	{
		players: [
			{
				displayName: "Bryn",
				pronouns: "They/Them",
				imagePath: playerImages.Bryn,
				score: 0,
				soundIndex: 0,
			},
			{
				displayName: "Indy",
				pronouns: "They/Them/He/Him",
				imagePath: playerImages.Indy,
				score: 0,
				soundIndex: 1,
			},
			{
				displayName: "Chelsea",
				pronouns: "She/Her",
				imagePath: playerImages.Chelsea,
				score: 0,
				soundIndex: 2,
			},
		],
		minigame: "Dopple-Banger",
	},
	{
		players: [
			{
				displayName: "Kristen",
				pronouns: "She/Her",
				imagePath: null,
				score: 0,
				soundIndex: 3,
			},
			{
				displayName: "Justin",
				pronouns: "He/Him",
				imagePath: playerImages.Justin,
				score: 0,
				soundIndex: 4,
			},
			{
				displayName: "Lindy",
				pronouns: "She/Her",
				imagePath: playerImages.Lindy,
				score: 0,
				soundIndex: 5,
			},
		],
		minigame: "Sexy Slogans",
	},
	{
		players: [
			{
				displayName: "Kim",
				pronouns: "She/Her",
				imagePath: playerImages.Kim,
				score: 0,
				soundIndex: 6,
			},
			{
				displayName: "Lisa",
				pronouns: "She/Her",
				imagePath: playerImages.Lisa,
				score: 0,
				soundIndex: 7,
			},
			{
				displayName: "Melissa",
				pronouns: "She/Her",
				imagePath: playerImages.Melissa,
				score: 0,
				soundIndex: 8,
			},
		],
		minigame: "Time Line",
	},
];
