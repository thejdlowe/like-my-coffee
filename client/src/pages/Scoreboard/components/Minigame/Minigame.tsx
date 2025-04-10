import { Stack, Box, Typography } from "@mui/material";
import { useAppContext } from "../../../../helpers/context";
import { MinigamePlayerColumn } from "./components";

export const Minigame = () => {
	const { serverState: gameState, currentRoundIndex } = useAppContext();
	const { fullShowData } = gameState;

	const currentRound = fullShowData.rounds[currentRoundIndex] || [];

	const players = currentRound && currentRound.players;
	const miniGame = currentRound && currentRound.minigame;
	return (
		<Stack>
			<Stack direction="row" sx={{ height: "80vh" }}>
				<MinigamePlayerColumn
					displayName={players[0].displayName}
					currentScore={players[0].score}
					pronouns={players[0].pronouns}
				/>
				<MinigamePlayerColumn
					displayName={players[1].displayName}
					currentScore={players[1].score}
					pronouns={players[1].pronouns}
				/>
				<MinigamePlayerColumn
					displayName={players[2].displayName}
					currentScore={players[2].score}
					pronouns={players[2].pronouns}
				/>
			</Stack>
			<Box sx={{ height: "10vh", position: "relative" }}>
				{
					<>
						<Typography
							sx={{
								position: "absolute",
								top: 0,
								left: "30%",
								transform: "transformX(-50%)",

								fontSize: "8vh",
								lineHeight: "1.4",
							}}
						>
							{miniGame}
						</Typography>
					</>
				}
			</Box>
		</Stack>
	);
};
