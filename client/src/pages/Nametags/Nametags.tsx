import { useAppContext } from "../../helpers/context";
import { useEffect } from "react";
import "./nametags.css";

export const Nametags = () => {
	const { serverState: gameState } = useAppContext();
	const { fullShowData } = gameState;
	const { rounds } = fullShowData;
	useEffect(() => {
		document.title = "Nametag Generator";
	}, []);
	return (
		<>
			{rounds.length &&
				[rounds[0], rounds[1], rounds[2]].map((round, index) => {
					return (
						<>
							<div className="page">
								{round.players.map((player: any) => {
									return (
										<div className="nametag" contentEditable="true">
											<div className="nametag-lmc-logo"> </div>
											<div className="nametag-name">{player.displayName}</div>
											<div className="nametag-pronouns">{player.pronouns}</div>
											<div className="nametag-mfp-logo"> </div>
										</div>
									);
								})}
							</div>
							<div className="right-page">
								{round.players.map((player: any, playerIndex: number) => {
									const playerNumber = playerIndex + 1;
									let color = "";
									if (playerNumber === 1) color = "green";
									if (playerNumber === 2) color = "red";
									if (playerNumber === 3) color = "yellow";
									return (
										<div className="nametag column" contentEditable="true">
											<div className="nametag-name">Round: {index + 1}</div>
											<div className="nametag-name">Mug Color: {color}</div>
											<div className="nametag-name">
												Mini Game:<br />{round.minigame}
											</div>
										</div>
									);
								})}
							</div>
						</>
					);
				})}
			{[0, 1].map((el) => {
				return (
					<div className={el === 0 ? "page" : "right-page"}>
						<div className="nametag" contentEditable="true">
							<div className="nametag-lmc-logo"> </div>
							<div className="nametag-name">Indy</div>
							<div className="nametag-pronouns">They/Them</div>
							<div className="nametag-mfp-logo"> </div>
						</div>
					</div>
				);
			})}
		</>
	);
};
