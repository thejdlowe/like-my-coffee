import { useState } from "react";
import { useAppContext } from "../../../../../../helpers/context";
export const CurrentBluetoothStatusHolder = () => {
	const { bluetoothControllers } = useAppContext();

	const [showModal, setShowModal] = useState<boolean>(false);
	return (
		<>
			{showModal && (
				<div
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						backgroundColor: "rgba(0, 0, 0, 0.3)",
						display: "flex",
					}}
					onClick={() => {
						setShowModal(false);
					}}
				>
					<div
						style={{
							width: "50%",
							height: "30%",
							backgroundColor: "White",
						}}
					>
						{Object.keys(bluetoothControllers).map((mac) => {
							const status = bluetoothControllers[mac].status;
							const battery = bluetoothControllers[mac].battery;
							let color;
							if (status === "disconnected") color = "red";
							else if (status === "connecting") color = "yellow";
							else if (status === "connected") color = "green";
							return (
								<div>
									<span
										style={{
											margin: "auto 10px",
											width: "10px",
											height: "10px",
											border: "1px solid black",
											borderRadius: "99px",
											backgroundColor: color,
										}}
									>
										&nbsp;
									</span>
									{mac}
								</div>
							);
						})}
					</div>
				</div>
			)}
			<div
				onClick={() => {
					setShowModal(true);
				}}
			>
				Show Bluetooth status
			</div>
		</>
	);
};
