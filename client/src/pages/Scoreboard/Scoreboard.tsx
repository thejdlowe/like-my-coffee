import { useAppContext } from "../../helpers/context";
import { scoreboardStates } from "../../sharedCopy";
import {
	Screensaver,
	FinalRound,
	Maingame,
	Minigame,
	MysteryScreen,
	CreditsScreen,
	ForcedImageScreen,
	PreMainGame,
	ShowCredits
} from "./components";
import { useEffect } from "react";
export const Scoreboard = () => {
	useEffect(() => {
		document.title = "Scoreboard";
	}, []);
	const { currentRoundIndex, currentScreenState } = useAppContext();
	if (
		currentScreenState === scoreboardStates.SCREEN_SAVER ||
		currentRoundIndex < 0
	)
		return <Screensaver />;
	else if (currentScreenState === scoreboardStates.MINI_GAME)
		return <Minigame />;
	else if (currentScreenState === scoreboardStates.IN_ROUND)
		return <Maingame />;
	else if (currentScreenState === scoreboardStates.FINAL_ROUND)
		return <FinalRound />;
	else if (currentScreenState === scoreboardStates.SECRET_VIDEO)
		return <MysteryScreen />;
	else if (currentScreenState === scoreboardStates.CREDITS)
		return <ShowCredits />;
	else if (currentScreenState === scoreboardStates.PRE_ROUND)
		return <PreMainGame />;
	else if (currentScreenState === scoreboardStates.FORCED_IMAGE_1)
		return <ForcedImageScreen image="image1" />;
	else if (currentScreenState === scoreboardStates.FORCED_IMAGE_2)
		return <ForcedImageScreen image="image2" />;
	else if (currentScreenState === scoreboardStates.FORCED_IMAGE_3)
		return <ForcedImageScreen image="image3" />;
	else if (currentScreenState === scoreboardStates.FORCED_IMAGE_4)
		return <ForcedImageScreen image="image4" />;
	else if (currentScreenState === scoreboardStates.FORCED_IMAGE_5)
		return <ForcedImageScreen image="image5" />;
	else return <>invalid state?</>;
};
