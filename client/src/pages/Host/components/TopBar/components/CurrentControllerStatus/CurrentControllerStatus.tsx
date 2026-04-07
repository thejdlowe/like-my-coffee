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
				{Object.keys(bluetoothControllers).map((mac) => {
					return (
						<>
							{mac}: {JSON.stringify(bluetoothControllers[mac])}
						</>
					);
				})}
				<div>
					<Button
						onClick={() => {
							fetch(`${URL}/updateBluetoothStatuses/`, {
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
