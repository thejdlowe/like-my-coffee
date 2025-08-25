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
import { ChangeEvent } from "react";

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
				<option key={-1} value={"screensaver"}>
					{"screensaver"}
				</option>
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
					<option key={index} value={el}>
						{value}
					</option>
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
						<option key={index} value={el}>
							{value}
						</option>
					);
				}
			});
		}

		return els;
	};

	return (
		<Box>
			<FormControl sx={{ m: 1, minWidth: 150 }}>
				<select
					onChange={(event: ChangeEvent<HTMLSelectElement>) => {
						console.log(event.target.value);
						setCurrentShowState(event.target.value);
					}}
					value={currentScreenState}
				>
					{buildDropDown()}
				</select>
				
				<FormHelperText>Set Status</FormHelperText>
			</FormControl>
		</Box>
	);
};
