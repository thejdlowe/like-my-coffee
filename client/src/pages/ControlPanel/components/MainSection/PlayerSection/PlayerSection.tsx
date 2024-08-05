import { Stack, Typography, Button } from "@mui/material";
import { useState } from "react";
import { useAppContext } from "../../../../../helpers/context";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import PublishIcon from "@mui/icons-material/Publish";

export const PlayerSection = ({
	displayName,
	currentScore,
	playerIndex,
}: {
	displayName: string;
	currentScore: number;
	playerIndex: number;
}) => {
	const [scoreChangeValue, setScoreChange] = useState<number>(0);
	const { scoreChange } = useAppContext();
	return (
		<Stack sx={{ width: "33%" }}>
			<Typography>{displayName}</Typography>
			<Typography>{currentScore}</Typography>
			<Typography>
				<AddCircleIcon
					onClick={() => {
						setScoreChange((prev) => ++prev);
					}}
				/>
			</Typography>
			<Typography>{scoreChangeValue}</Typography>
			<Typography>
				<RemoveCircleIcon
					onClick={() => {
						setScoreChange((prev) => --prev);
					}}
				/>
			</Typography>
			<Typography>
				<PublishIcon
					onClick={() => {
						scoreChange(scoreChangeValue, playerIndex);
						setScoreChange(0);
					}}
				/>
			</Typography>
		</Stack>
	);
};
