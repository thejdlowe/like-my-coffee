import {
	FormControl,
	MenuItem,
	Select,
	SelectChangeEvent,
	Box,
	FormHelperText,
} from "@mui/material";
import { scoreboardStates } from "../../../../../../sharedCopy";
import { useAppContext } from "../../../../../../helpers/context";

export const CurrentGameStateDropdown = () => {
	const { gameState, setCurrentShowState } = useAppContext();

	const changeDropdown = (event: SelectChangeEvent) => {
		setCurrentShowState(event.target.value);
	};

	return (
		<Box>
			<FormControl sx={{ m: 1, minWidth: 150 }}>
				<Select onChange={changeDropdown} value={gameState.currentState}>
					{Object.values(scoreboardStates).map((el, index) => {
						const value = el;
						return (
							<MenuItem key={index} value={el}>
								{value}
							</MenuItem>
						);
					})}
				</Select>
				<FormHelperText>Set Status</FormHelperText>
			</FormControl>
		</Box>
	);
};
