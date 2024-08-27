import { Stack, Typography } from "@mui/material";
export const PlayerColumn = ({
	displayName,
	currentScore,
	buzzedIn,
	color,
	pronouns,
}: {
	displayName: string;
	currentScore: number;
	buzzedIn: boolean;
	color: string;
	pronouns: string;
}) => {
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
