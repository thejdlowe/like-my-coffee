import { Stack, Typography } from "@mui/material";
import { useParams } from "react-router";
import { useAppContext } from "../../helpers/context";
import { DefaultPlayerDisplay } from "./components";
import { playerColors } from "../../sharedCopy";

export const PlayerDisplay = () => {
	const { id } = useParams();
	const {
		serverState: gameState,
		currentPlayerBuzzedIn,
		currentRoundIndex,
	} = useAppContext();
	const { fullShowData, hasStarted } = gameState;
	const currentRound = fullShowData.rounds[currentRoundIndex] || [];
	const players = currentRound && currentRound.players;
	if (!id || isNaN(parseInt(id)) || !players || !hasStarted)
		return <DefaultPlayerDisplay />;
	const index = parseInt(id);
	const player = players[index];
	const { displayName, score, pronouns, soundIndex } = player;
	const buzzedIn = index === currentPlayerBuzzedIn;
	const colors = [
		playerColors.PLAYER_ONE,
		playerColors.PLAYER_TWO,
		playerColors.PLAYER_THREE,
	];
	/*
    {
  "displayName": "Karissa",
  "pronouns": "She/Her",
  "score": 0,
  "soundIndex": 0,
  "isWinner": false
}
    */
	return (
		<Stack
			sx={{
				height: "100%",
				...(buzzedIn && {
					backgroundColor: colors[index],
					WebkitTextStroke: "1px black",
					color: "white",
				}),
			}}
		>
			<center>
				<Typography sx={{ fontSize: "20vh" }}>{displayName}</Typography>
				<Typography sx={{ fontSize: "10vh" }}>{pronouns}</Typography>
				<Typography sx={{ fontSize: "30vh" }}>{score}</Typography>
			</center>
		</Stack>
	);
};
