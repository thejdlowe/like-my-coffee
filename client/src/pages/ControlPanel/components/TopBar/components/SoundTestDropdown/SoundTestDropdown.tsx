import { useState } from "react";
import {
	Box,
	FormControl,
	MenuItem,
	Select,
	SelectChangeEvent,
	FormHelperText,
} from "@mui/material";
import { useAppContext } from "../../../../../../helpers/context";
import { useSounds } from "../../../../../../helpers/sounds";

export const SoundTestDropdown = () => {
	const { allSoundsObject } = useSounds();
	const { setDemoSound } = useAppContext();
	const [currentSound, setCurrentSound] = useState("");

	const changeDropdown = (event: SelectChangeEvent) => {
		const value = event.target.value;
		if (value === "") return;
		setCurrentSound(value);
		setDemoSound(value);
	};
	return (
		<Box>
			<FormControl sx={{ m: 1, minWidth: 150 }}>
				<Select onChange={changeDropdown} value={currentSound}>
					<MenuItem value={""}>No Sound</MenuItem>
					{Object.keys(allSoundsObject).map((key) => {
						return <MenuItem value={key}>{key}</MenuItem>;
					})}
				</Select>
				<FormHelperText>Test Sound</FormHelperText>
			</FormControl>
		</Box>
	);
};
