import { Stack, Typography } from "@mui/material";
export const MinigamePlayerColumn = ({
	displayName,
	currentScore,
	pronouns,
}: {
	displayName: string;
	currentScore: number;
	pronouns: string;
}) => {
	return (
		<Stack
			sx={{
				width: "33%",
			}}
			justifyContent="center"
			alignItems="center"
		>
			<Typography>{displayName}</Typography>
			<Typography>{pronouns}</Typography>
			<Typography>{currentScore}</Typography>
		</Stack>
	);
};
