import {
	Box,
	FormControl,
	MenuItem,
	Select,
	SelectChangeEvent,
	FormHelperText,
} from "@mui/material";
import { useAppContext } from "../../../../../../helpers/context";

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

	const {fullShowData} = gameState;
	const {rounds} = fullShowData
	return (
		<Box>
			<FormControl sx={{ m: 1, minWidth: 150 }}>
				<Select onChange={changeDropdown} value={currentRoundIndex + ""}>
					<MenuItem value={-1}>Pre Game</MenuItem>
					{rounds.map((el, index) => {return (<MenuItem value={index}>Round {index + 1}</MenuItem>)}) }
				</Select>
				<FormHelperText>Select Round</FormHelperText>
			</FormControl>
		</Box>
	);
};
