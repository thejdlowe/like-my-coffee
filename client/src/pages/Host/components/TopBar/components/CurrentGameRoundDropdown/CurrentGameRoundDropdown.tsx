import {
	Box,
	FormControl,
	MenuItem,
	Select,
	SelectChangeEvent,
	FormHelperText,
} from "@mui/material";
import { useAppContext } from "../../../../../../helpers/context";
import { ChangeEvent } from "react";

export const CurrentGameRoundDropdown = () => {
	const {
		serverState: gameState,
		currentRoundIndex,
		setRoundIndex,
	} = useAppContext();

	const changeDropdown = (event: SelectChangeEvent) => {
		const value = event.target.value;
		//if (parseInt(value) < 0) return;
		setRoundIndex(parseInt(value));
	};

	const { fullShowData } = gameState;
	const { rounds } = fullShowData;
	return (
		<Box>
			<FormControl sx={{ m: 1, minWidth: 150 }}>
				<select
					onChange={(event: ChangeEvent<HTMLSelectElement>) => {
						const value = event.target.value;
						//if (parseInt(value) < 0) return;
						setRoundIndex(parseInt(value));
					}}
					value={currentRoundIndex + ""}
				>
					<option value={-1}>Pre Game</option>
					{rounds.map((el, index) => {
						return <option value={index}>Round {index + 1}</option>;
					})}
					<option value={99}>Secret Video</option>
					<option value={100}>Credits Video</option>
				</select>
				<FormHelperText>Select Round</FormHelperText>
			</FormControl>
		</Box>
	);
};
