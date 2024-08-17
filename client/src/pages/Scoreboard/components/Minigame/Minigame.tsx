import { Stack, LinearProgress, Box, Typography } from "@mui/material";
import { useAppContext } from "../../../../helpers/context";
import { MinigamePlayerColumn } from "./components";

export const Minigame = () => {
	let progressBarColor = "green";
	let progressText = "Like My *Blank*";
	const { gameState } = useAppContext();
	const { fullShowData, currentRoundIndex, currentTimerPercentage } = gameState;
	if (currentTimerPercentage <= 33) {
		progressText = "Threesomes Are Like *Blank*";
		progressBarColor = "red";
	} else if (currentTimerPercentage <= 66) {
		progressText = "Sex With Me Is Like *Blank*";
		progressBarColor = "yellow";
	} else {
		progressText = "Like My *Blank*";
		progressBarColor = "green";
	}
	const currentRound = fullShowData.rounds[currentRoundIndex] || [];
	const players = currentRound && currentRound.players;
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
				{currentTimerPercentage >= 0 && (
					<>
						<LinearProgress
							variant="determinate"
							value={currentTimerPercentage}
							sx={{
								"& .MuiLinearProgress-bar": {
									backgroundColor: progressBarColor,
								},
								height: "10vh",
							}}
						/>
						<Typography
							sx={{
								position: "absolute",
								top: 0,
								left: "30%",
								transform: "transformX(-50%)",
								"-webkit-text-stroke": "1px black",
								color: "white !important",
								fontSize: "8vh",
								lineHeight: "1.4",
							}}
						>
							{progressText}
						</Typography>
					</>
				)}
			</Box>
		</Stack>
	);
};
