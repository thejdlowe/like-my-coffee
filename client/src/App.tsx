import { Routes, Route } from "react-router-dom";
import { AppContextProvider } from "./helpers/context";
import { ControlPanel } from "./pages/ControlPanel";
import { Scoreboard } from "./pages/Scoreboard";
import { PlayerDisplay } from "./pages/PlayerDisplay";
import { CssBaseline } from "@mui/material";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./App.css";

function App() {
	const handle = useFullScreenHandle();
	const location = useLocation();
	const { pathname } = location;
	useEffect(() => {
		const startFullScreen = () => {
			handle.enter();
			document.removeEventListener("keypress", startFullScreen);
			document.removeEventListener("click", startFullScreen);
		};
		if (pathname === "/") {
			document.addEventListener("keypress", startFullScreen);
			document.addEventListener("click", startFullScreen);
		}
		return () => {
			document.removeEventListener("keypress", startFullScreen);
			document.removeEventListener("click", startFullScreen);
		};
	}, [pathname]);
	return (
		<>
			<FullScreen handle={handle}>
				<CssBaseline />
				<AppContextProvider>
					<Routes>
						<Route path="/" element={<div style={{cursor: "none"}}><Scoreboard /></div>} />
						<Route path="/controlpanel" element={<ControlPanel />} />
						<Route path="/playerdisplay/:id" element={<PlayerDisplay />} />
					</Routes>
				</AppContextProvider>
			</FullScreen>
		</>
	);
}

export default App;
