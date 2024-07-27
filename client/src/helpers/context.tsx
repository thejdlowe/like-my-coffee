import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
} from "react";
// import { FullStateType } from "../../../shared/types";
// import { scoreboardStates } from "../../../shared/consts";

import { useNavigate, useLocation } from "react-router-dom";
import { socket } from "./socket";

const AppContext = createContext({
	gameState: {
		currentTimerValue: -1,
		currentState: "",
		currentPlayerBuzzedIn: -1,
		currentRoundIndex: -1,
		rounds: [],
	},
	setCurrentShowState: (newState: string) => {},
	setStartRound: () => {},
});

interface AppContextProviderProps {
	children?: React.ReactNode | React.ReactNode[];
}

export const AppContextProvider: React.FC<AppContextProviderProps> = ({
	children,
}) => {
	const [gameState, setGameState] = useState({
		currentTimerValue: -1,
		currentState: "",
		currentPlayerBuzzedIn: -1,
		currentRoundIndex: -1,
		rounds: [],
	});

	const setCurrentShowState = useCallback((newState: string) => {
		socket.emit("newShowState", newState);
	}, []);

	const setStartRound = useCallback(() => {
		socket.emit("startRound");
	}, []);
	useEffect(() => {
		function setFullState(newState: any) {
			console.log(newState);
			setGameState(newState);
		}

		socket.on("state", setFullState);
	}, []);
	// socket.on("state", (value) => {
	// 	console.log(value);
	// 	setGameState(value);
	// });
	return (
		<AppContext.Provider value={{ gameState, setCurrentShowState, setStartRound }}>
			{children}
		</AppContext.Provider>
	);
};

export const useAppContext = () => {
	const value = useContext(AppContext);
	return value;
};
