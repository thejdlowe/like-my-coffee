import {
	FormControl,
	MenuItem,
	Select,
	SelectChangeEvent,
	Box,
	FormHelperText,
	Button,
} from "@mui/material";
import { scoreboardStates } from "../../../../../../sharedCopy";
import { useAppContext } from "../../../../../../helpers/context";
export const SetScoreboardStatusButton = () => {
	const { serverState: gameState, startTimer } = useAppContext();
	return (
		<Button onClick={startTimer} variant="contained">
			Start Timer
		</Button>
	);
};
