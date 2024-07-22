import { Routes, Route } from "react-router-dom";
import { AppContextProvider } from "./helpers/context";
import { ControlPanel } from "./pages/ControlPanel";
import { Scoreboard } from "./pages/Scoreboard";
import { CssBaseline } from "@mui/material";
// import logo from './logo.svg';
// import './App.css';

function App() {
	return (
		<>
			<CssBaseline />
			<AppContextProvider>
				<Routes>
					<Route path="/" element={<Scoreboard />} />
					<Route path="/controlpanel" element={<ControlPanel />} />
				</Routes>
			</AppContextProvider>
		</>
	);
}

export default App;
