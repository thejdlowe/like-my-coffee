import { useAppContext } from "../../helpers/context";
import { scoreboardStates } from "../../sharedCopy";
import { Screensaver, FinalRound, Maingame, Minigame } from "./components";
import { useEffect } from "react";
export const Scoreboard = () => {
	useEffect(() => {
		document.title = "Scoreboard";
	}, []);
	const { gameState } = useAppContext();
	const { currentState, currentRoundIndex } = gameState;
	if (currentState === scoreboardStates.SCREEN_SAVER || currentRoundIndex < 0)
		return <Screensaver />;
	else if (currentState === scoreboardStates.MINI_GAME) return <Minigame />;
	else if (currentState === scoreboardStates.IN_ROUND) return <Maingame />;
	else if (currentState === scoreboardStates.FINAL_ROUND) return <FinalRound />;
	else return <>invalid state?</>;
};
