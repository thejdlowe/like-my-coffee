import { Stack, Typography } from "@mui/material";
import { useState } from "react";
import { useAppContext } from "../../../../../helpers/context";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import PublishIcon from "@mui/icons-material/Publish";

export const PlayerSection = ({
	displayName,
	currentScore,
	playerIndex,
	buzzedIn,
	color,
}: {
	displayName: string;
	currentScore: number;
	playerIndex: number;
	buzzedIn: boolean;
	color: string;
}) => {
	const [scoreChangeValue, setScoreChange] = useState<number>(0);
	const { scoreChange } = useAppContext();
	return (
		<Stack
			sx={{
				width: "33%",
				...(buzzedIn && {
					backgroundColor: color,
					WebkitTextStroke: "1px black",
					color: "white",
				}),
			}}
			justifyContent="center"
			alignItems="center"
		>
			<Typography>{displayName}</Typography>
			<Typography>{currentScore}</Typography>
			<Typography>
				<AddCircleIcon
					sx={{ fontSize: 110 }}
					onClick={() => {
						setScoreChange((prev) => ++prev);
					}}
				/>
			</Typography>
			<Typography>{scoreChangeValue}</Typography>
			<Typography>
				<RemoveCircleIcon
					sx={{ fontSize: 110 }}
					onClick={() => {
						setScoreChange((prev) => --prev);
					}}
				/>
			</Typography>
			<Typography>
				<PublishIcon
					sx={{ fontSize: 100 }}
					onClick={() => {
						scoreChange(scoreChangeValue, playerIndex);
						setScoreChange(0);
					}}
				/>
			</Typography>
		</Stack>
	);
};
