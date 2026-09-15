import { ShowType } from "../../sharedCopy";
import { minigames } from "./games";

export const show: ShowType = {
	rounds: [
		{
			players: [
				{
					displayName: "Joe",
					pronouns: "He/Him",
					score: 0,
					soundIndex: 0,
					isWinner: false,
				},
				{
					displayName: "Elliott",
					pronouns: "He/Him",
					score: 0,
					soundIndex: 1,
					isWinner: false,
				},
				{
					displayName: "???",
					pronouns: "They/Them",
					score: 0,
					soundIndex: 2,
					isWinner: false,
				},
			],
			minigame: minigames.kids.name,
			example: minigames.kids.example,
			timelength: 12,
			prompts: [
				"Something in your living room",
				"Profession you want",
				"Something you want",
			],
		},
		{
			players: [
				{
					displayName: "Max",
					pronouns: "He/Him",
					score: 0,
					soundIndex: 3,
					isWinner: false,
				},
				{
					displayName: "J.D.",
					pronouns: "He/Him",
					score: 0,
					soundIndex: 4,
					isWinner: false,
				},
				{
					displayName: "Skye",
					pronouns: "They/She",
					score: 0,
					soundIndex: 5,
					isWinner: false,
				},
			],
			minigame: minigames.sponsored.name,
			example: minigames.sponsored.example,
			timelength: 12,
			prompts: [
				"Something in your kitchen",
				"Profession you work now",
				"Something you need",
			],
		},
		{
			players: [
				{
					displayName: "Kevin",
					pronouns: "He/Him",
					score: 0,
					soundIndex: 6,
					isWinner: false,
				},
				{
					displayName: "Karen",
					pronouns: "Any/All",
					score: 0,
					soundIndex: 7,
					isWinner: false,
				},
				{
					displayName: "Allison",
					pronouns: "She/Her/They",
					score: 0,
					soundIndex: 8,
					isWinner: false,
				},
			],
			minigame: minigames.sponsored.name,
			example: minigames.sponsored.example,
			timelength: 12,
			prompts: [
				"Something in your bathroom",
				"Profession you hate",
				"Something you hate",
			],
		},
		{
			players: [
				{
					displayName: "Dummy Data",
					pronouns: "",
					score: 0,
					soundIndex: 9,
					isWinner: false,
				},
				{
					displayName: "Dummy Data",
					pronouns: "",
					score: 0,
					soundIndex: 10,
					isWinner: false,
				},
				{
					displayName: "Dummy Data",
					pronouns: "",
					score: 0,
					soundIndex: 11,
					isWinner: false,
				},
			],
			minigame: "",
			example: "",
			timelength: 10,
			prompts: [
				"Something in your Attic/Basement",
				"Profession you're unqualified for",
				"Something someone gave you",
			],
		},
	],
	images: [
		"Allison.png",
		"Elliott.png",
		"JD.png",
		"Joe.png",
		"Karen.png",
		"Kevin.png",
		"Max.png",
		"Motts.png",
		"Skye.png",
		"Indy.png",
		"GCAC.png",
		"Linktree.png",
		"AI.png",
		"Apply.png",
	],
	logo: "logo.png",
};
