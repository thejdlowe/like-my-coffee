import { useAppContext } from "../../helpers/context";
import { scoreboardStates } from "../../sharedCopy";
import {
	Screensaver,
	FinalRound,
	Maingame,
	Minigame,
	MysteryScreen,
	CreditsScreen,
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
		return <CreditsScreen />;
	else return <>invalid state?</>;
};
