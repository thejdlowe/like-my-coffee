import { Stack, Typography } from "@mui/material";
import { useState } from "react";
import { useAppContext } from "../../../../../helpers/context";
import { ControllerStatusType } from "../../../../../sharedCopy";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import PublishIcon from "@mui/icons-material/Publish";
import GavelIcon from "@mui/icons-material/Gavel";

export const PlayerSection = ({
	displayName,
	currentScore,
	playerIndex,
	buzzedIn,
	color,
	controllerStatus,
	isWinner,
}: {
	displayName: string;
	currentScore: number;
	playerIndex: number;
	buzzedIn: boolean;
	isWinner: boolean;
	color: string;
	controllerStatus: ControllerStatusType;
}) => {
	const [scoreChangeValue, setScoreChange] = useState<number>(0);
	const { currentScreenState, scoreChange, winnerChange } = useAppContext();
	return (
		<Stack
			sx={{
				width: "33%",
				...(buzzedIn && {
					backgroundColor: color,
					WebkitTextStroke: "1px black",
					color: "white",
				}),
				...(isWinner && {
					border: "5px solid gold",
				}),
			}}
			justifyContent="center"
			alignItems="center"
		>
			{currentScreenState === "minigame" && (
				<Typography>
					<GavelIcon
						sx={{ fontSize: 50 }}
						onClick={() => {
							winnerChange(playerIndex);
						}}
					/>
				</Typography>
			)}
			<Typography variant="h2">{displayName}</Typography>
			<Typography variant="h3">{currentScore}</Typography>
			<Typography>
				<AddCircleIcon
					sx={{ fontSize: 100 }}
					onClick={() => {
						setScoreChange((prev) => ++prev);
					}}
				/>
			</Typography>
			<Typography variant="h2">{scoreChangeValue}</Typography>
			<Typography>
				<RemoveCircleIcon
					sx={{ fontSize: 100 }}
					onClick={() => {
						setScoreChange((prev) => --prev);
					}}
				/>
			</Typography>
			<Typography>
				<PublishIcon
					sx={{ fontSize: 96 }}
					onClick={() => {
						scoreChange(scoreChangeValue, playerIndex);
						setScoreChange(0);
					}}
				/>
			</Typography>
			{controllerStatus.powerPercentage !== -1 && (
				<Typography variant="h2">{controllerStatus.powerPercentage}</Typography>
			)}
		</Stack>
	);
};
