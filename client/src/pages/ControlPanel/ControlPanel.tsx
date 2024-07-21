import { useAppContext } from "../../helpers/context";
import { scoreboardStates } from "../../../../shared/consts";
import { useEffect } from "react";
export const ControlPanel = () => {
	const { gameState } = useAppContext();
	useEffect(() => {
		console.log(gameState);
	}, [gameState]);
	return <div>Fart</div>;
};
