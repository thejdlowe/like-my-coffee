//import { useAppContext } from "../../../../helpers/context";
import {
	CurrentGameRoundDropdown,
	CurrentGameStateDropdown,
	CurrentTimer,
} from "./components";
import { Stack } from "@mui/material";

export const TopBar = () => {
	//const { gameState } = useAppContext();
	return (
		<Stack direction="row">
			<CurrentGameRoundDropdown />
			<CurrentGameStateDropdown />
			<CurrentTimer />
		</Stack>
	);
};
