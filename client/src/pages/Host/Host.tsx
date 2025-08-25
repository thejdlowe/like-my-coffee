import { Stack } from "@mui/material";
import { TopBar, MainSection } from "./components";
import { useEffect } from "react";
export const Host = () => {
	useEffect(() => {
		document.title = "Host";
	}, []);
	return (
		<Stack display="flex" justifyContent="space-between">
			<MainSection />
			<div style={{position: "fixed", bottom: 0}}>
                <TopBar />
            </div>
		</Stack>
	);
};
