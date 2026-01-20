import { ShowType } from "../../sharedCopy";
import { minigames } from "./games";

export const show: ShowType = {
	rounds: [
		{
			players: [
				{
					displayName: "Karissa",
					pronouns: "She/Her",
					score: 0,
					soundIndex: 0,
					isWinner: false,
				},
				{
					displayName: "Lisa",
					pronouns: "She/Her",
					score: 0,
					soundIndex: 1,
					isWinner: false,
				},
				{
					displayName: "Tristan",
					pronouns: "They/Them",
					score: 0,
					soundIndex: 2,
					isWinner: false,
				},
			],
			minigame: minigames.sponsored.name,
			example: minigames.sponsored.example,
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
					displayName: "Kim",
					pronouns: "She/Her",
					score: 0,
					soundIndex: 3,
					isWinner: false,
				},
				{
					displayName: "Kitty",
					pronouns: "She/Her",
					score: 0,
					soundIndex: 4,
					isWinner: false,
				},
				{
					displayName: "Indy",
					pronouns: "They/Them",
					score: 0,
					soundIndex: 5,
					isWinner: false,
				},
			],
			minigame: minigames.scare.name,
			example: minigames.scare.example,
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
					displayName: "Chelsea",
					pronouns: "She/Her",
					score: 0,
					soundIndex: 6,
					isWinner: false,
				},
				{
					displayName: "Tiffany",
					pronouns: "She/Her",
					score: 0,
					soundIndex: 7,
					isWinner: false,
				},
				{
					displayName: "Ross",
					pronouns: "He/Him",
					score: 0,
					soundIndex: 8,
					isWinner: false,
				},
			],
			minigame: minigames.communication.name,
			example: minigames.communication.example,
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
		"Apply.png",
		"Chelsea.png",
		"Indy.png",
		"Karissa.png",
		"Kim.png",
		"Kitty.png",
		"JD.png",
		"Tiffany.png",
		"Lisa.png",
		"Ross.png",
		"Tristan.png",
		"Trophy.png",
		"Social.png",
	],
	logo: "logo.png",
	apply: "Apply.png",
	social: "Social.png",
};
