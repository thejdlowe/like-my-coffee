import { Stack } from "@mui/material";
import { TopBar } from "./components";
import { useEffect } from "react";
export const ControlPanel = () => {
	/*const { gameState } = useAppContext();
	useEffect(() => {
		console.log(gameState);
	}, [gameState]);*/
	//return <div>Fart</div>;
	return (
		<Stack display="flex" justifyContent="space-between">
			<TopBar />
		</Stack>
	);
};
