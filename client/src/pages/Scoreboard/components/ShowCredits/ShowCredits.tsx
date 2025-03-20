import { useEffect } from "react";
import "./showCredits.css";
export const ShowCredits = () => {
    const els = [];
    for(var i = 0;i<50;i++) {
        els.push(<p>Contents {i}</p>)
    }
	return (
		<div id="credits">
			<div id="credits-holder">
				{els}
			</div>
            <div id="credits-holder">
				{els}
			</div>
		</div>
	);
};
