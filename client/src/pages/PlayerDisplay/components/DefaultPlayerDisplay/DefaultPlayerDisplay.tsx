import { useAppContext } from "../../../../helpers/context";
export const DefaultPlayerDisplay = () => {
	const { serverState: gameState } = useAppContext();
	const { logo } = gameState.fullShowData;
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
				src={`../${logo}`}
			/>
		</center>
	);
};
