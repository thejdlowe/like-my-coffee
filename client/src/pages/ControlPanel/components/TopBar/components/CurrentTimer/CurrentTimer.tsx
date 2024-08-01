import { Typography } from "@mui/material";
import { scoreboardStates } from "../../../../../../sharedCopy";
import { useAppContext } from "../../../../../../helpers/context";
import { useEffect } from "react";

export const CurrentTimer = () => {
	const { gameState } = useAppContext();
	const timeRemaining = gameState.currentTimerValue;

	const minutesRemaining = Math.floor(timeRemaining / 60);
	let minutesRemainingStr = "";
	if (minutesRemaining <= 0) minutesRemainingStr = "0";
	else minutesRemainingStr = minutesRemaining.toString();

	const secondsRemaining = Math.floor(timeRemaining % 60);
	let secondsRemainingStr = "";
	if (secondsRemaining <= 0) secondsRemainingStr = "0";
	else secondsRemainingStr = secondsRemaining.toString();

	if (gameState.currentState !== scoreboardStates.IN_ROUND) return null;

	return (
		<Typography variant="h2" gutterBottom>
			{minutesRemainingStr.padStart(2, "0")}:
			{secondsRemainingStr.padStart(2, "0")}
		</Typography>
	);
};
