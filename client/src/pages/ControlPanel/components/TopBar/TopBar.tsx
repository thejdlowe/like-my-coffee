import {
	CurrentGameRoundDropdown,
	CurrentGameStateDropdown,
	CurrentTimer,
	SetScoreboardStatusButton,
	SoundTestDropdown,
	CurrentUsbReceiverConnectedStatusIndicator,
	CurrentBluetoothStatusHolder,
	PowerFunctionsHolder,
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
			<CurrentUsbReceiverConnectedStatusIndicator />
			<CurrentBluetoothStatusHolder />
			<PowerFunctionsHolder />
		</Stack>
	);
};
