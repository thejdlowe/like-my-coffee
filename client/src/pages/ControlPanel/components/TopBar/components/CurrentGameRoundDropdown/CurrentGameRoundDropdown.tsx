import {
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	FormHelperText,
} from "@mui/material";
import { scoreboardStates } from "../../../../../../sharedCopy";
import { useAppContext } from "../../../../../../helpers/context";

export const CurrentGameRoundDropdown = () => {
	const { gameState, setRoundIndex } = useAppContext();

	const changeDropdown = (event: SelectChangeEvent) => {
		const value = event.target.value;
		if (parseInt(value) < 0) return;
		setRoundIndex(parseInt(event.target.value));
	};
	return (
		<FormControl sx={{ m: 1, minWidth: 120 }}>
			<Select
				label="Select Round"
				onChange={changeDropdown}
				value={gameState.currentRoundIndex + ""}
			>
				<MenuItem value={-1}>Pre Game</MenuItem>
				<MenuItem value={0}>Round One</MenuItem>
				<MenuItem value={1}>Round Two</MenuItem>
				<MenuItem value={2}>Round Three</MenuItem>
				<MenuItem value={99}>Final Round</MenuItem>
			</Select>
			<FormHelperText>Select Round</FormHelperText>
		</FormControl>
	);
};
