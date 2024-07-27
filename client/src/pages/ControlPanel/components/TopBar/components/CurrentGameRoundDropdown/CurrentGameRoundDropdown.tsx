import {
	FormControl,
	MenuItem,
	Select,
	SelectChangeEvent,
} from "@mui/material";
import { scoreboardStates } from "../../../../../../sharedCopy";
import { useAppContext } from "../../../../../../helpers/context";

export const CurrentGameRoundDropdown = () => {
	const { gameState, setCurrentShowState } = useAppContext();

	const changeDropdown = (event: SelectChangeEvent) => {
		setCurrentShowState(event.target.value);
	};
	return (
		<FormControl>
			<Select onChange={changeDropdown} value={gameState.currentState}>
				<MenuItem value={-1}>Select Round</MenuItem>
				<MenuItem value={0}>Round One</MenuItem>
				<MenuItem value={1}>Round Two</MenuItem>
				<MenuItem value={2}>Round Three</MenuItem>
				<MenuItem value={99}>Final Round</MenuItem>
				{Object.values(scoreboardStates).map((el) => {
					const value = el;
					return <MenuItem value={el}>{value}</MenuItem>;
				})}
			</Select>
		</FormControl>
	);
};
