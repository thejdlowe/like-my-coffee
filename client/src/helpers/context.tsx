import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
} from "react";
import { ShowType } from "../../../shared/types";

import { useNavigate, useLocation } from "react-router-dom";
import { socket } from "./socket";

const AppContext = createContext({});

interface AppContextProviderProps {
	children?: React.ReactNode | React.ReactNode[];
}

export const AppContextProvider: React.FC<AppContextProviderProps> = ({
	children,
}) => {
	const [gameState, setGameState] = useState({});
	socket.on("state", (value) => {
		console.log(value);
	});
	return (
		<AppContext.Provider value={{ gameState }}>{children}</AppContext.Provider>
	);
};

export const useAppContext = () => {
	const value = useContext(AppContext);
	return value;
};
