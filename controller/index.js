const noble = require("@abandonware/noble");
async function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
  }

noble.on("stateChange", function (state) {
	if (state === "poweredOn") {
		noble.startScanning();
	} else {
		noble.stopScanning();
	}
});

console.log("Scanning for Bluetooth");

noble.on("discover", async function (device) {
	const mac = device.address; // retrieves the MAC address
	const goodMacs = ["D8:3A:DD:76:3D:40"];
	if (goodMacs.includes(mac.toUpperCase())) {
		console.log(`${mac} discovered`);
		await device.connectAsync();
		await sleep(3000);
		console.log(`${mac} connected, getting services`);
		

		device.discoverAllServicesAndCharacteristics(
			(err, services, characteristics) => {
				console.log("JD HERE");
				console.log({ err, services, characteristics });
				//https://www.bluetooth.com/wp-content/uploads/Files/Specification/HTML/Assigned_Numbers/out/en/Assigned_Numbers.pdf?v=1740981361600

				characteristics.forEach((characteristic) => {
					if (characteristic.uuid === "2a6f") {
						console.log(`Monitoring characteristic ${characteristic.uuid}`);
						let lastdata = null;

						setInterval(async () => {
							const newdata = await characteristic.readAsync();
							if (lastdata !== newdata.toString()) {
								console.log(
									"Data received from controler: ",
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
