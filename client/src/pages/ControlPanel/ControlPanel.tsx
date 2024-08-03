import { Stack } from "@mui/material";
import { TopBar } from "./components";
import { useEffect } from "react";
export const ControlPanel = () => {
	useEffect(() => {
		document.title = "Control Panel";
	}, []);
	return (
		<Stack display="flex" justifyContent="space-between">
			<TopBar />
		</Stack>
	);
};
