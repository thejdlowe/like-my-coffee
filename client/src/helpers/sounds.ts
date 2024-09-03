export const useSounds = () => {
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
		metalgearsolid = () => playSound("codec.mp3"),
		ready = () => playSound("playersready.wav");

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
		ready,
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

	return { allSoundsObject, gameSoundsArr };
};
