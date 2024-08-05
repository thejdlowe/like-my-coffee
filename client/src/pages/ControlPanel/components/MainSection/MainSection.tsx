import { Stack, Typography } from "@mui/material";
import { useAppContext } from "../../../../helpers/context";
import { PlayerSection } from "./PlayerSection";
export const MainSection = () => {
	const { gameState } = useAppContext();
	const { fullShowData, currentRoundIndex } = gameState;
	let header;
	if (currentRoundIndex < 0) header = "Pre-Round";
	else if (currentRoundIndex > 2) header = "Final Round";
	else header = `Round ${currentRoundIndex + 1}`;
	const currentRound = fullShowData.rounds[currentRoundIndex] || [];
	return (
		<Stack>
			<Typography variant="h1">{header}</Typography>
			<Stack direction="row">
				{currentRound &&
					currentRound.players &&
					currentRound.players.map((player, index) => {
						return (
							<PlayerSection
								displayName={player.displayName}
								currentScore={player.score}
								playerIndex={index}
							/>
						);
					})}
			</Stack>
		</Stack>
	);
};
