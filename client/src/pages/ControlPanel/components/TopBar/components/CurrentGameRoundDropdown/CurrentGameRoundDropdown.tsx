import {
	Box,
	FormControl,
	InputLabel,
	Button,
	MenuItem,
	Select,
	SelectChangeEvent,
	FormHelperText,
} from "@mui/material";
import { scoreboardStates } from "../../../../../../sharedCopy";
import { useAppContext } from "../../../../../../helpers/context";

export const CurrentGameRoundDropdown = () => {
	const { gameState, currentRoundIndex, setRoundIndex } = useAppContext();

	const changeDropdown = (event: SelectChangeEvent) => {
		const value = event.target.value;
		//if (parseInt(value) < 0) return;
		setRoundIndex(parseInt(value));
	};
	return (
		<Box>
			<FormControl sx={{ m: 1, minWidth: 150 }}>
				<Select
					onChange={changeDropdown}
					value={currentRoundIndex + ""}
				>
					<MenuItem value={-1}>Pre Game</MenuItem>
					<MenuItem value={0}>Round One</MenuItem>
					<MenuItem value={1}>Round Two</MenuItem>
					<MenuItem value={2}>Round Three</MenuItem>
					<MenuItem value={99}>Final Round</MenuItem>
				</Select>
				<FormHelperText>Select Round</FormHelperText>
			</FormControl>
		</Box>
	);
};
