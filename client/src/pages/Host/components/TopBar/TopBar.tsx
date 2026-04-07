import {
	CurrentGameRoundDropdown,
	CurrentGameStateDropdown,
	CurrentTimer,
	SetScoreboardStatusButton,
	SetFullScreen,
	CurrentControllerStatus,
} from "./components";
import { Stack } from "@mui/material";

export const TopBar = () => {
	return (
		<Stack direction="row" spacing={0.5}>
			<CurrentGameRoundDropdown />
			<CurrentGameStateDropdown />
			<CurrentTimer />
			<SetScoreboardStatusButton />
			<CurrentControllerStatus />
			<SetFullScreen />
		</Stack>
	);
};
