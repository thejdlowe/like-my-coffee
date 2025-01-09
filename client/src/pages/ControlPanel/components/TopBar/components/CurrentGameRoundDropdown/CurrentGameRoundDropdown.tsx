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
	return (
		<Box>
			<FormControl sx={{ m: 1, minWidth: 150 }}>
				<Select onChange={changeDropdown} value={currentRoundIndex + ""}>
					<MenuItem value={-1}>Pre Game</MenuItem>
					<MenuItem value={0}>Round One</MenuItem>
					<MenuItem value={1}>Round Two</MenuItem>
					<MenuItem value={2}>Round Three</MenuItem>
					<MenuItem value={3}>Round Four</MenuItem>
				</Select>
				<FormHelperText>Select Round</FormHelperText>
			</FormControl>
		</Box>
	);
};
