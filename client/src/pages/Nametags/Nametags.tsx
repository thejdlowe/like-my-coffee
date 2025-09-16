import { Stack, Typography, Box } from "@mui/material";
import { useAppContext } from "../../helpers/context";
import "./nametags.css";

export const Nametags = () => {
	const { serverState: gameState } = useAppContext();
	//const players = [gameState.fullShowData.rounds[0].players]
	const { fullShowData } = gameState;
	const { rounds } = fullShowData;
	let players: any = [];
	if (rounds.length) {
		players = [
			...rounds[0].players,
			...rounds[1].players,
			...rounds[2].players,
		];
	}

	console.log(players);
	//const players = [...rounds[0].players]
	return (
		<>
			{players.map((player: any) => {
				return (
					<div className="nametag">
						<div className="nametag-lmc-logo"> </div>
						<div className="nametag-name">{player.displayName}</div>
						<div className="nametag-pronouns">{player.pronouns}</div>
						<div className="nametag-mfp-logo"></div>
					</div>
				);
			})}
		</>
	);
};
