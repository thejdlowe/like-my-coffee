import { Stack, Typography, Box } from "@mui/material";
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
	const descriptors = [
		["Living Room", "Profession you want", "Something you want"],
		["Kitchen", "Profession you work now", "Something you need"],
		["Bathroom", "Profession you hate", "Something you hate"],
		[
			"Attic/Basement",
			"Profession you're unqualified for",
			"Something someone gave you",
		],
	];
	const { fullShowData } = gameState;
	let header;
	if (currentRoundIndex < 0) header = "Pre-Round";
	else if (currentRoundIndex > 2) header = "Final Round";
	else header = `Round ${currentRoundIndex + 1}`;
	const currentRound = fullShowData.rounds[currentRoundIndex] || [];
	const currentDescriptors = descriptors[currentRoundIndex] || [];
	return (
		<Stack>
			<Typography variant="h1">{header}</Typography>
			<Stack direction="row">
				<Stack direction="row" sx={{ width: "66%", display: "inline-flex" }}>
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
				<Stack sx={{ width: "33%" }}>
					<b>Descriptors:</b>
					{currentDescriptors.map((desc) => {
						return <Box>{desc}</Box>;
					})}
					<Box sx={{marginTop: "10px"}}><b>Minigame</b>: {currentRound.minigame}</Box>
				</Stack>
			</Stack>
		</Stack>
	);
};
