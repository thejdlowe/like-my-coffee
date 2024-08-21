import { Routes, Route } from "react-router-dom";
import { AppContextProvider } from "./helpers/context";
import { ControlPanel } from "./pages/ControlPanel";
import { Scoreboard } from "./pages/Scoreboard";
import { CssBaseline } from "@mui/material";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { useEffect } from "react";
import "./App.css";

function App() {
	const handle = useFullScreenHandle();
	useEffect(() => {
		const startFullScreen = () => {
			handle.enter();
			document.removeEventListener("keypress", startFullScreen);
			document.removeEventListener("click", startFullScreen);
		};
		
		document.addEventListener("keypress", startFullScreen);
		document.addEventListener("click", startFullScreen);
		return () => {
			document.removeEventListener("keypress", startFullScreen);
			document.removeEventListener("click", startFullScreen);
		};
	}, []);
	return (
		<>
			<FullScreen handle={handle}>
				<CssBaseline />
				<AppContextProvider>
					<Routes>
						<Route path="/" element={<Scoreboard />} />
						<Route path="/controlpanel" element={<ControlPanel />} />
					</Routes>
				</AppContextProvider>
			</FullScreen>
		</>
	);
}

export default App;
