import {
	CurrentGameRoundDropdown,
	CurrentGameStateDropdown,
	CurrentTimer,
	SetScoreboardStatusButton,
	SetFullScreen,
} from "./components";
import { Stack } from "@mui/material";

export const TopBar = () => {
	return (
		<Stack direction="row" spacing={0.5}>
			<CurrentGameRoundDropdown />
			<CurrentGameStateDropdown />
			<CurrentTimer />
			<SetScoreboardStatusButton />
			<SetFullScreen />
		</Stack>
	);
};
