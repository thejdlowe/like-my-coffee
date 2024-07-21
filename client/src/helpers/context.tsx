import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
} from "react";
import { FullStateType } from "../../../shared/types";
import { scoreboardStates } from "../../../shared/consts";

import { useNavigate, useLocation } from "react-router-dom";
import { socket } from "./socket";

const AppContext = createContext({
	gameState: {
		currentTimerValue: -1,
		currentState: 0,
		currentPlayerBuzzedIn: -1,
		currentRoundIndex: -1,
		rounds: [],
	},
});

interface AppContextProviderProps {
	children?: React.ReactNode | React.ReactNode[];
}

export const AppContextProvider: React.FC<AppContextProviderProps> = ({
	children,
}) => {
	const [gameState, setGameState] = useState({
		currentTimerValue: -1,
		currentState: 0,
		currentPlayerBuzzedIn: -1,
		currentRoundIndex: -1,
		rounds: [],
	});
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
		<AppContext.Provider value={{ gameState }}>{children}</AppContext.Provider>
	);
};

export const useAppContext = () => {
	const value = useContext(AppContext);
	return value;
};
