//const noble = require("@abandonware/noble");
import noble from "@abandonware/noble";
import { goodMacs } from "./macaddresses.js";
async function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

noble.on("stateChange", async function (state) {
	if (state === "poweredOn") {
		await noble.startScanningAsync();
	} else {
		await noble.stopScanningAsync();
	}
});

noble.on("error", () => {
	console.log(arguments)
})

noble.on('warning', (message) => {
	console.log(message)
});

console.log("Scanning for Bluetooth");

noble.on("discover", async function (device) {
	const mac = device.address; // retrieves the MAC address

	if (goodMacs.includes(mac.toUpperCase())) {
		console.log(`${mac} discovered`);
		await noble.stopScanningAsync();
		console.log(`Scanning stopped`);

		await device.connectAsync();
		console.log("Sleep for 5 seconds");
		await sleep(5000);
		console.log(`${mac} connected, getting services`);

		device.discoverAllServicesAndCharacteristics(
			async (err, services, characteristics) => {
				console.log(`Services found for ${mac}`)
				//https://www.bluetooth.com/wp-content/uploads/Files/Specification/HTML/Assigned_Numbers/out/en/Assigned_Numbers.pdf?v=1740981361600
				await noble.startScanningAsync();

				characteristics.forEach((characteristic) => {
					if (characteristic.uuid === "2a6f") {
						console.log(`Monitoring characteristic ${characteristic.uuid}`);
						let lastdata = null;

						setInterval(async () => {
							const newdata = await characteristic.readAsync();
							if (lastdata !== newdata.toString()) {
								console.log(
									"Data received from controller: ",
									newdata.toString()
								);
								lastdata = newdata.toString();
								const controllernumber = lastdata.split("&")[0];
								fetch(`http://localhost:3001/buzz/${controllernumber}`);
							}
						}, 100);
					}
				});
			}
		);
	}
});
