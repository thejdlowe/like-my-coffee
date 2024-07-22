import {
	FormControl,
	MenuItem,
	Select,
	SelectChangeEvent,
} from "@mui/material";
import { scoreboardStates } from "../../../../../../sharedCopy";
import { useAppContext } from "../../../../../../helpers/context";

export const CurrentGameStateDropdown = () => {
	const { gameState, setCurrentShowState } = useAppContext();
    

	const changeDropdown = (event: SelectChangeEvent) => {
		setCurrentShowState(event.target.value);
	};
	return (
		<FormControl>
			<Select onChange={changeDropdown} value={gameState.currentState}>
				{Object.values(scoreboardStates).map((el) => {
					const value = el;
					return <MenuItem value={el}>{value}</MenuItem>;
				})}
			</Select>
		</FormControl>
	);
};
