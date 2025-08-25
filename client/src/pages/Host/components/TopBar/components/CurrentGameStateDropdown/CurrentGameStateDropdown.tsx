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
	const { setCurrentShowState, currentScreenState, currentRoundIndex } =
		useAppContext();

	const changeDropdown = (event: SelectChangeEvent) => {
		console.log(event.target.value);
		setCurrentShowState(event.target.value);
	};

	const buildDropDown = () => {
		let els: any = [];
		if (currentRoundIndex === -1) {
			els.push(
				<MenuItem key={-1} value={"screensaver"}>
					{"screensaver"}
				</MenuItem>
			);
		} else if (currentRoundIndex < 99) {
			els = Object.values(scoreboardStates).map((el, index) => {
				const value = el;
				if (
					el === scoreboardStates.SECRET_VIDEO ||
					el === scoreboardStates.CREDITS ||
					el === scoreboardStates.SCREEN_SAVER
				)
					return null;
				return (
					<MenuItem key={index} value={el}>
						{value}
					</MenuItem>
				);
			});
		} else {
			els = Object.values(scoreboardStates).map((el, index) => {
				const value = el;

				if (
					el === scoreboardStates.CREDITS ||
					el === scoreboardStates.SECRET_VIDEO ||
					el === scoreboardStates.SCREEN_SAVER ||
					el === scoreboardStates.FINAL_ROUND
				) {
					return (
						<MenuItem key={index} value={el}>
							{value}
						</MenuItem>
					);
				}
			});
		}

		return els;
	};

	return (
		<Box>
			<FormControl sx={{ m: 1, minWidth: 150 }}>
				<Select onChange={changeDropdown} value={currentScreenState}>
					{buildDropDown()}
				</Select>
				<FormHelperText>Set Status</FormHelperText>
			</FormControl>
		</Box>
	);
};
