import { useRef } from "react";
import { useAppContext } from "../../../../../../helpers/context";
import { URL } from "../../../../../../helpers/socket";
import Button from "@mui/material/Button/Button";

export const CurrentControllerStatus = () => {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const { bluetoothControllers } = useAppContext();

	return (
		<>
			<div
				onClick={() => {
					dialogRef.current?.showModal();
				}}
			>
				Current Controller Status
			</div>
			<dialog ref={dialogRef}>
				<p>
					Controller Status:
					<button onClick={() => dialogRef.current?.close()}>Close</button>
				</p>
				<div style={{ display: "flex", flexWrap: "wrap" }}>
					{Object.keys(bluetoothControllers).map((mac) => {
						return (
							<div style={{ flex: "1 0 30%", margin: "5px" }}>
								<div>{mac}</div>
								<div>Status: {bluetoothControllers[mac].status}</div>
								<div>Battery: {bluetoothControllers[mac].battery}</div>
								<div>Temperature: {bluetoothControllers[mac].temperature}</div>
								<div>
									Last Received Data: {bluetoothControllers[mac].lastUpdated}
								</div>
							</div>
						);
					})}
				</div>

				<div>
					<Button
						onClick={() => {
							fetch(`${URL}/updateControllerStatuses/`, {
								method: "GET",
							});
						}}
					>
						Fetch All Statuses
					</Button>
				</div>
			</dialog>
		</>
	);
};
