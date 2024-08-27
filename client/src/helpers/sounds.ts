import useSound from "use-sound";
const SOUND_URL = "/sounds/all sound effects.mp3";

export const useSounds = () => {
	const [play, { stop }] = useSound(SOUND_URL, {
		sprite: {
			intro: [0, 3366],
			outro: [3970, 7328 - 3970],
			donkeykong: [7817, 8449 - 7817],
			pacman: [8450, 8991 - 8450],
			link: [8996, 9467 - 8996],
			candycrush: [9510, 10374 - 9510],
			aol: [10643, 11153 - 10643],
			digdug: [11185, 11665 - 11185],
			discord: [11812, 12163 - 11812],
			jeopardy: [12309, 12900 - 12309],
			metalgearsolid: [12966, 14315 - 12966],
		},
	});

	const playSound = (fileName: string, onend?: () => void) => {
		const audioElement = new Audio(`sounds/${fileName}`);
		audioElement.preload = "auto";
		audioElement.addEventListener("ended", () => {
			onend && onend();
		});
		audioElement.play();
	};

	const intro = () => playSound("intro.mp3"),
		outro = () => playSound("amongus.mp3"),
		donkeykong = () => playSound("dk-a2600_over.wav"),
		pacman = () => playSound("eat_ghost.wav"),
		link = () => playSound("WARC_SE_255.wav"),
		candycrush = () => playSound("colour_bomb_created.wav"),
		aol = () => playSound("aol-instant-messenger-trimmed.mp3"),
		digdug = () => playSound("09-monster-touched-digdug.mp3"),
		discord = () => playSound("discord-notification.mp3"),
		jeopardy = () => playSound("times-up.mp3"),
		metalgearsolid = () => playSound("codec.mp3");

	const allSoundsObject = {
		intro,
		outro,
		donkeykong,
		pacman,
		link,
		candycrush,
		aol,
		digdug,
		discord,
		jeopardy,
		metalgearsolid,
	};

	const gameSoundsArr = [
		donkeykong,
		pacman,
		link,
		candycrush,
		aol,
		digdug,
		discord,
		jeopardy,
		metalgearsolid,
	];

	return { allSoundsObject, gameSoundsArr, stop };
};
