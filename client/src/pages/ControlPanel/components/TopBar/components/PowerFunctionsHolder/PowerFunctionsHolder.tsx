import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import { useState } from "react";
import { Button } from "@mui/material";
export const PowerFunctionsHolder = () => {
	const [showMainModal, setShowMainModal] = useState<boolean>(false);
	const [showRebootModal, setShowRebootModal] = useState<boolean>(false);
	const [showShutdownModal, setShowShutdownModal] = useState<boolean>(false);
	return (
		<>
			{showRebootModal && (
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
						setShowRebootModal(false);
					}}
				>
					<div
						style={{
							width: "50%",
							height: "30%",
							backgroundColor: "White",
						}}
					>
						<Button
							onClick={() => {
								fetch(`http://likemycoffee.local:3001/forcerebootnowdangit/`, {
									method: "GET",
								});
							}}
						>
							Reboot For Reals
						</Button>
					</div>
				</div>
			)}
			{showShutdownModal && (
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
						setShowShutdownModal(false);
					}}
				>
					<div
						style={{
							width: "50%",
							height: "30%",
							backgroundColor: "White",
						}}
					>
						<Button
							onClick={() => {
								fetch(`http://likemycoffee.local:3001/forceshutdownawwwman/`, {
									method: "GET",
								});
							}}
						>
							Power Off For Reals
						</Button>
					</div>
				</div>
			)}
			{showMainModal && (
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
						setShowMainModal(false);
					}}
				>
					<div
						style={{
							width: "50%",
							height: "30%",
							backgroundColor: "White",
						}}
					>
						<Button
							onClick={() => {
								if (confirm("Are you sure you want to power off?")) {
									fetch(
										`http://likemycoffee.local:3001/forceshutdownawwwman/`,
										{
											method: "GET",
										}
									);
								}
							}}
						>
							Power Off
						</Button>
						<br />
						<Button
							onClick={() => {
								if (confirm("Are you sure you want to power off?")) {
									fetch(
										`http://likemycoffee.local:3001/forcerebootnowdangit/`,
										{
											method: "GET",
										}
									);
								}
							}}
						>
							Restart
						</Button>
					</div>
				</div>
			)}
			<div style={{ position: "absolute", top: 0, right: 0 }}>
				<PowerSettingsNewIcon
					onClick={() => {
						setShowMainModal(true);
					}}
				/>
			</div>
		</>
	);
};
