import { useAppContext } from "../../../../helpers/context";
import { useEffect } from "react";
import Carousel from 'react-material-ui-carousel';

export const Screensaver = () => {
	const { gameState } = useAppContext();
	const { logo, social, apply, images } = gameState.fullShowData;
	useEffect(() => {
		console.log(gameState);
	}, []);
	return <center><img style={{
		width: '100wh',
		height: '95vh',
		marginLeft: 'auto',
		marginRight: 'auto',
	}} src={logo} /></center>;
};
