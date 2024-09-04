import {
	CurrentGameRoundDropdown,
	CurrentGameStateDropdown,
	CurrentTimer,
	SetScoreboardStatusButton,
	SoundTestDropdown,
} from "./components";
import { Stack } from "@mui/material";

export const TopBar = () => {
	return (
		<Stack direction="row">
			<CurrentGameRoundDropdown />
			<CurrentGameStateDropdown />
			<CurrentTimer />
			<SetScoreboardStatusButton />
			<SoundTestDropdown />
		</Stack>
	);
};
