import { Stack, LinearProgress, Box } from "@mui/material";
import { useAppContext } from "../../../../helpers/context";
import { PlayerColumn } from "./components";

export const Maingame = () => {
	let progressBarColor = "green";
	let progressText = "Like My *Blank*";
	const { gameState } = useAppContext();
	const {
		fullShowData,
		currentRoundIndex,
		currentPlayerBuzzedIn,
		currentTimerPercentage,
	} = gameState;
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
				<PlayerColumn
					displayName={players[0].displayName}
					currentScore={players[0].score}
					buzzedIn={currentPlayerBuzzedIn === 0}
					color="#3cdb4e"
					pronouns={players[0].pronouns}
				/>
				<PlayerColumn
					displayName={players[1].displayName}
					currentScore={players[1].score}
					buzzedIn={currentPlayerBuzzedIn === 1}
					color="#d04242"
					pronouns={players[1].pronouns}
				/>
				<PlayerColumn
					displayName={players[2].displayName}
					currentScore={players[2].score}
					buzzedIn={currentPlayerBuzzedIn === 2}
					color="#ecdb33"
					pronouns={players[2].pronouns}
				/>
			</Stack>
			<Box sx={{ height: "10vh", position: "relative" }}>
				{currentTimerPercentage >= 0 && (
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
				)}
			</Box>
		</Stack>
	);
};
