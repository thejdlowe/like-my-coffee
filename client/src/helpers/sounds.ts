export const useSounds = () => {
	const playSound = (fileName: string, onend?: () => void) => {
		const audioElement = new Audio(`sounds/${fileName}`);
		audioElement.preload = "auto";
		audioElement.addEventListener("ended", () => {
			onend && onend();
		});
		audioElement.play();
	};

	const intro = (onend?: () => void) => playSound("intro.mp3", onend),
		outro = (onend?: () => void) => playSound("amongus.mp3", onend),
		donkeykong = (onend?: () => void) => playSound("dk-a2600_over.mp3", onend),
		pacman = (onend?: () => void) => playSound("eat_ghost.mp3", onend),
		link = (onend?: () => void) => playSound("WARC_SE_255.wav", onend),
		candycrush = (onend?: () => void) =>
			playSound("colour_bomb_created.mp3", onend),
		aol = (onend?: () => void) =>
			playSound("aol-instant-messenger-trimmed.mp3", onend),
		digdug = (onend?: () => void) =>
			playSound("09-monster-touched-digdug.mp3", onend),
		discord = (onend?: () => void) =>
			playSound("discord-notification.mp3", onend),
		jeopardy = (onend?: () => void) => playSound("times-up.mp3", onend),
		metalgearsolid = (onend?: () => void) => playSound("codec.mp3", onend),
		windowserror = (onend?: () => void) => playSound("WindowsError.mp3", onend),
		stardewvalley = (onend?: () => void) =>
			playSound("stardew-fishing_EimR00g.mp3", onend),
		streetfighter = (onend?: () => void) => playSound("coin_1.mp3", onend),
		bowser = (onend?: () => void) => playSound("bowser.mp3", onend),
		ready = (onend?: () => void) => playSound("playersready.mp3", onend);

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
		windowserror,
		stardewvalley,
		streetfighter,
		bowser,
		ready,
	};

	const gameSoundsArr = [
		donkeykong,
		pacman,
		bowser,
		link,
		candycrush,
		aol,
		digdug,
		discord,
		windowserror,
		metalgearsolid,
		stardewvalley,
		streetfighter,
	];

	return { allSoundsObject, gameSoundsArr };
};
