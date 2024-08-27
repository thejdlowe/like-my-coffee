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
			<Typography
				variant="h1"
				sx={{ fontSize: "8vh !important", lineHeight: "1.4" }}
			>
				{displayName}
			</Typography>
			<Typography variant="h3">{pronouns}</Typography>
			<Typography
				variant="h1"
				sx={{ fontSize: "8vh !important", lineHeight: "1.4" }}
			>
				{currentScore}
			</Typography>
		</Stack>
	);
};
