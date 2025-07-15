import { Stack, LinearProgress, Box, Typography } from "@mui/material";
import { useAppContext } from "../../../../helpers/context";
import { PlayerColumn } from "./components";
import { playerColors } from "../../../../sharedCopy";

export const Maingame = () => {
	let progressBarColor = "green";
	let progressText = "Like My *Blank*";
	let promptIndex = 0;
	const {
		serverState: gameState,
		currentPlayerBuzzedIn,
		currentTimerPercentage,
		currentRoundIndex,
	} = useAppContext();
	const { fullShowData, hasStarted } = gameState;
	if (currentTimerPercentage <= 33) {
		progressText = "Threesomes Are Like *Blank*";
		progressBarColor = "red";
		promptIndex = 2;
	} else if (currentTimerPercentage <= 66) {
		progressText = "Sex With Me Is Like *Blank*";
		progressBarColor = "yellow";
		promptIndex = 1;
	} else {
		progressText = "Like My *Blank*";
		progressBarColor = "green";
		promptIndex = 0;
	}
	const currentRound = fullShowData.rounds[currentRoundIndex] || [];
	const players = currentRound && currentRound.players;
	const currentPrompt = currentRound.prompts[promptIndex];
	return (
		<Stack>
			<Stack direction="row" sx={{ height: "80vh" }}>
				<PlayerColumn
					displayName={players[0].displayName}
					currentScore={players[0].score}
					buzzedIn={currentPlayerBuzzedIn === 0}
					color={playerColors.PLAYER_ONE}
					pronouns={players[0].pronouns}
				/>
				<PlayerColumn
					displayName={players[1].displayName}
					currentScore={players[1].score}
					buzzedIn={currentPlayerBuzzedIn === 1}
					color={playerColors.PLAYER_TWO}
					pronouns={players[1].pronouns}
				/>
				<PlayerColumn
					displayName={players[2].displayName}
					currentScore={players[2].score}
					buzzedIn={currentPlayerBuzzedIn === 2}
					color={playerColors.PLAYER_THREE}
					pronouns={players[2].pronouns}
				/>
			</Stack>
			{hasStarted && (
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
								{currentPrompt}
							</Typography>
						</>
					)}
				</Box>
			)}
		</Stack>
	);
};
