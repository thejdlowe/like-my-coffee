import { useAppContext } from "../../../../helpers/context";
import { useState, useEffect } from "react";
import Carousel from "react-material-ui-carousel";

export const Screensaver = () => {
	const { gameState } = useAppContext();
	const { logo, social, apply, images } = gameState.fullShowData;
	console.log(logo);
	const [whatToRender, setWhatToRender] = useState<any>([]);

	useEffect(() => {
		setWhatToRender(
			<img
				style={{
					width: "100wh",
					height: "95vh",
					marginLeft: "auto",
					marginRight: "auto",
				}}
				src={logo}
			/>
		);

		const screensave = setTimeout(() => {
			setWhatToRender([
				<Carousel
					indicators={false}
					interval={10000}
					autoPlay={true}
					swipe={false}
					animation="fade"
					duration={2000}
					stopAutoPlayOnHover={false}
				>
					{images.map((el, index) => (
						<img
							key={index}
							style={{
								width: "100wh",
								height: "95vh",
								marginLeft: "auto",
								marginRight: "auto",
							}}
							src={el}
						/>
					))}
				</Carousel>,
			]);
		}, 6000);
		return () => {
			clearTimeout(screensave);
		};
	}, [logo]);
	return <center>{whatToRender}</center>;
};
