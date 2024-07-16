import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import { AppContextProvider } from "./helpers/context";
// import logo from './logo.svg';
// import './App.css';

function App() {
	return (
		<Router>
			<AppContextProvider>
				<div>Test</div>
			</AppContextProvider>
		</Router>
	);
}

export default App;
