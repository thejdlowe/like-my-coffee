import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import { useState } from "react";
import { Button } from "@mui/material";
export const PowerFunctionsHolder = () => {
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
				<PowerSettingsNewIcon />
			</div>
		</>
	);
};
