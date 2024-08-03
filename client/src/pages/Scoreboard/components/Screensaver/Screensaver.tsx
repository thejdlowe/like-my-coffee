import { useAppContext } from "../../../../helpers/context";
import { useEffect } from "react";
export const Screensaver = () => {
	const { gameState } = useAppContext();
	useEffect(() => {
		console.log(gameState);
	}, []);
	return <>Screen saver</>;
};
