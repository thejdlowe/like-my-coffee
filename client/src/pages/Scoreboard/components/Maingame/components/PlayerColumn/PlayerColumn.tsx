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
			<Typography>{displayName}</Typography>
			<Typography>{pronouns}</Typography>
			<Typography>{currentScore}</Typography>
		</Stack>
	);
};
