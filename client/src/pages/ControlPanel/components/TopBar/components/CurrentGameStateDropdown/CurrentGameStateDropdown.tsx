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

	return (
		<Box>
			<FormControl sx={{ m: 1, minWidth: 150 }}>
				<Select onChange={changeDropdown} value={currentScreenState}>
					{Object.values(scoreboardStates).map((el, index) => {
						const value = el;
						if (currentRoundIndex < 99) {
							if (
								el === scoreboardStates.SECRET_VIDEO ||
								el === scoreboardStates.CREDITS
							)
								return null;
							return (
								<MenuItem key={index} value={el}>
									{value}
								</MenuItem>
							);
						} else {
							//if(el !== scoreboardStates.SECRET_VIDEO || el !== scoreboardStates.CREDITS) return null;
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
						}
					})}
				</Select>
				<FormHelperText>Set Status</FormHelperText>
			</FormControl>
		</Box>
	);
};
