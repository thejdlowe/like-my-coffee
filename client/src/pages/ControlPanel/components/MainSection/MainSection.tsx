import { Stack, Typography } from "@mui/material";
import { useAppContext } from "../../../../helpers/context";
import { PlayerSection } from "./PlayerSection";
import { playerColors } from "../../../../sharedCopy";
export const MainSection = () => {
	const {
		serverState: gameState,
		currentPlayerBuzzedIn,
		currentRoundIndex,
	} = useAppContext();
	const colors = [
		playerColors.PLAYER_ONE,
		playerColors.PLAYER_TWO,
		playerColors.PLAYER_THREE,
	];
	const { fullShowData } = gameState;
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
								key={index}
								buzzedIn={index === currentPlayerBuzzedIn}
								displayName={player.displayName}
								currentScore={player.score}
								playerIndex={index}
								color={colors[index]}
							/>
						);
					})}
			</Stack>
		</Stack>
	);
};
