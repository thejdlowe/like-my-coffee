import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppContextProvider } from "./helpers/context";
import { ControlPanel } from "./pages/ControlPanel";
import { Scoreboard } from "./pages/Scoreboard";
// import logo from './logo.svg';
// import './App.css';

function App() {
	return (
		<Router>
			<AppContextProvider>
				<Routes>
					<Route path="/" element={<Scoreboard />} />
					<Route path="/controlpanel" element={<ControlPanel />} />
				</Routes>
			</AppContextProvider>
		</Router>
	);
}

export default App;
