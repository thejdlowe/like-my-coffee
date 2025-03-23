//const noble = require("@abandonware/noble");
import noble from "@abandonware/noble";

const { goodMacs } = require("./macaddresses.js");
async function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

const characteristicsObj = {};

const initBluetooth = async () => {
	try {
		const rawResponse = await fetch(`http://localhost:3001/setupbluetooth/`, {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				macs: goodMacs,
			}),
		});
		noble.on("stateChange", async function (state) {
			if (state === "poweredOn") {
				console.log("Antennae Powered On");
				await noble.startScanningAsync();
			} else {
				console.log("Current state:", state);
				await noble.stopScanningAsync();
			}
		});

		noble.on("warning", (message) => {
			console.log(`Noble Warning: ${message}`);
			noble.reset();
		});

		console.log("Scanning for Bluetooth");

		noble.on("discover", async (device) => {
			const mac = device.address; // retrieves the MAC address

			if (goodMacs.includes(mac.toUpperCase())) {
				console.log(`${mac} discovered`);
				await noble.stopScanningAsync();
				console.log(`Scanning stopped. Connecting.`);
				await device.connectAsync();
				const rawResponse = await fetch(`http://localhost:3001/bluetooth/`, {
					method: "POST",
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						mac: mac.toUpperCase(),
						status: "connecting",
						battery: "",
					}),
				});
				/*
				const rawResponse = await fetch('https://httpbin.org/post', {
			method: 'POST',
			headers: {
			  'Accept': 'application/json',
			  'Content-Type': 'application/json'
			},
			body: JSON.stringify({a: 1, b: 'Textual content'})
		  });
		  const content = await rawResponse.json();
		
		  console.log(content);
				*/
				console.log(`Sleep 5 seconds`);
				await sleep(5000);

				console.log(`${mac} connected, getting characteristics`);

				device.once("disconnect", async () => {
					console.log(`${mac} disconnected`);
					delete characteristicsObj[mac];
					const rawResponse = await fetch(`http://localhost:3001/bluetooth/`, {
						method: "POST",
						headers: {
							Accept: "application/json",
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							mac: mac.toUpperCase(),
							status: "disconnected",
							battery: "",
						}),
					});
				});

				device.discoverAllServicesAndCharacteristics(
					async (err, services, characteristics) => {
						console.log(`Services found for ${mac}`);
						//https://www.bluetooth.com/wp-content/uploads/Files/Specification/HTML/Assigned_Numbers/out/en/Assigned_Numbers.pdf?v=1740981361600
						await noble.startScanningAsync();
						console.log("Resuming Scanning");

						characteristics.forEach(async (characteristic) => {
							if (characteristic.uuid === "2a6f") {
								console.log(`Monitoring characteristic ${characteristic.uuid}`);
								let lastdata = null;

								characteristicsObj[mac] = characteristic;

								const rawResponse = await fetch(
									`http://localhost:3001/bluetooth/`,
									{
										method: "POST",
										headers: {
											Accept: "application/json",
											"Content-Type": "application/json",
										},
										body: JSON.stringify({
											mac: mac.toUpperCase(),
											status: "connected",
											battery: "",
										}),
									}
								);

								let myHandle = setInterval(async () => {
									if (characteristicsObj[mac]) {
										const newdata = await characteristic.readAsync();
										if (lastdata !== newdata.toString()) {
											console.log(
												"Data received from controller: ",
												newdata.toString()
											);
											lastdata = newdata.toString();
											const values = lastdata.split("&");
											const controllernumber = values[0];
											const batteryLevel = values[1];
											const temperature = values[2];
											fetch(`http://localhost:3001/buzz/${controllernumber}`, {
												method: "POST",
												headers: {
													Accept: "application/json",
													"Content-Type": "application/json",
												},
												body: JSON.stringify({
													batteryLevel,
													temperature,
												}),
											});
											//fetch(`http://localhost:3001/buzz/${controllernumber}`);
										}
									} else {
										clearInterval(myHandle);
									}
								}, 100);
							}
						});
					}
				);
			}
		});
	} catch (e) {
		console.log(
			`Failed to initialize Bluetooth, server not started. Sleep 5 seconds`
		);
		await sleep(5000);
		initBluetooth();
	}
};

initBluetooth();

// Graceful shutdown on process exit
process.on("SIGINT", () => {
	console.log("Stopping scanning...");
	noble.stopScanning(() => {
		process.exit(1);
	});
});
