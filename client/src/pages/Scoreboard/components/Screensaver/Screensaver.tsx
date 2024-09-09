import { useAppContext } from "../../../../helpers/context";
import { useState, useEffect } from "react";
import Carousel from "react-material-ui-carousel";

export const Screensaver = () => {
	const { serverState: gameState } = useAppContext();
	const { logo, social, apply, images } = gameState.fullShowData;
	const [whatToRender, setWhatToRender] = useState<any>([]);

	useEffect(() => {
		setWhatToRender(
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
		);

		const screensave = setTimeout(() => {
			const allImages = images;
			
			setWhatToRender(
				<Carousel
					indicators={false}
					interval={10000}
					autoPlay={true}
					swipe={false}
					animation="fade"
					duration={2000}
					stopAutoPlayOnHover={false}
				>
					{allImages.map((el, index) => (
						<img
							alt=""
							key={index}
							style={{
								width: "100wh",
								height: "100vh",
								marginLeft: "auto",
								marginRight: "auto",
							}}
							src={el}
						/>
					))}
				</Carousel>
			);
		}, 60000);
		return () => {
			clearTimeout(screensave);
		};
	}, [logo, apply, images, social]);
	return <center>{whatToRender}</center>;
};
