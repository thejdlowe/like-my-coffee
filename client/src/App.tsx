import { Routes, Route } from "react-router-dom";
import { AppContextProvider } from "./helpers/context";
import { ControlPanel } from "./pages/ControlPanel";
import { Scoreboard } from "./pages/Scoreboard";
import { Nametags } from "./pages/Nametags";
import { Host } from "./pages/Host";
import { PlayerDisplay } from "./pages/PlayerDisplay";
import { CssBaseline } from "@mui/material";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import "./App.css";

function App() {
	const handle = useFullScreenHandle();
	const location = useLocation();
	const { pathname } = location;
	const setFullScreen = useCallback(() => {
		handle.enter();
	}, [handle]);
	const exitFullScreen = useCallback(() => {
		handle.exit();
	}, [handle]);
	useEffect(() => {
		console.log(pathname);
		const startFullScreen = () => {
			handle.enter();
			document.removeEventListener("keypress", startFullScreen);
			document.removeEventListener("click", startFullScreen);
		};

		if (pathname === "/" || pathname.includes("playerdisplay")) {
			document.addEventListener("keypress", startFullScreen);
			document.addEventListener("click", startFullScreen);
		}
		if (pathname === "/host") {
			const setFullScreenButton = document.querySelector("#setFullScreen");
			setFullScreenButton?.removeEventListener("click", setFullScreen);
			setFullScreenButton?.addEventListener("click", setFullScreen);

			const removeFullScreenButton =
				document.querySelector("#removeFullScreen");
			removeFullScreenButton?.removeEventListener("click", exitFullScreen);
			removeFullScreenButton?.addEventListener("click", exitFullScreen);
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
						<Route
							path="/"
							element={
								<div style={{ cursor: "none" }}>
									<Scoreboard />
								</div>
							}
						/>
						<Route path="/host" element={<Host />} />
						<Route path="/controlpanel" element={<ControlPanel />} />
						<Route path="/nametags" element={<Nametags />} />
						<Route path="/playerdisplay/:id" element={<PlayerDisplay />} />
					</Routes>
				</AppContextProvider>
			</FullScreen>
		</>
	);
}

export default App;
