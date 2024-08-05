import { Stack, Typography } from "@mui/material";
import { useAppContext } from "../../../../helpers/context";
import { PlayerColumn } from "./components";
export const Maingame = () => {
	const { gameState } = useAppContext();
	const { fullShowData, currentRoundIndex, currentPlayerBuzzedIn } = gameState;
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
		</Stack>
	);
};
