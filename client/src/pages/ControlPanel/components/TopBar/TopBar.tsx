//import { useAppContext } from "../../../../helpers/context";
import { CurrentGameStateDropdown, CurrentTimer } from "./components";
import { Stack } from "@mui/material";

export const TopBar = () => {
	//const { gameState } = useAppContext();
	return (
		<Stack direction="row">
			<CurrentGameStateDropdown />
			<CurrentTimer />
		</Stack>
	);
};
