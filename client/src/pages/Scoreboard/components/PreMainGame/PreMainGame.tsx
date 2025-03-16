import { useAppContext } from "../../../../helpers/context";
import { useSounds } from "../../../../helpers/sounds";
import { scoreboardStates } from "../../../../sharedCopy";
import { useState, useEffect } from "react";
import Carousel from "react-material-ui-carousel";

export const PreMainGame = () => {
	const { allSoundsObject } = useSounds();
	const { serverState: gameState, setCurrentShowState } = useAppContext();
	const { logo } = gameState.fullShowData;

	useEffect(() => {
		allSoundsObject.intro(() => {
			setCurrentShowState(scoreboardStates.IN_ROUND);
		});
	}, []);

	return (
		<center>
			<img
				alt=""
				style={{
					width: "100wh",
					height: "95vh",
					marginLeft: "auto",
					marginRight: "auto",
				}}
				src={logo}
			/>
		</center>
	);
};
