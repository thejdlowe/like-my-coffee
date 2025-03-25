import asyncio
import logging
logger = logging.getLogger(__name__)
import time
from bleak import BleakClient, BleakScanner
import requests
import json

goodMacs = [
    "D8:3A:DD:76:3D:40",
    "28:CD:C1:10:AF:02",
    "D8:3A:DD:76:3D:08",
    "28:CD:C1:10:AF:5E",
    "28:CD:C1:10:AD:E6",
    "28:CD:C1:10:00:F0",
    "D8:3A:DD:76:3D:08",
    # Add more devices as needed
]
NOTIFY_UUID = "00002A6F-0000-1000-8000-00805f9b34fb"

def initialize_bluetooth(tries=0):
    try:
        url = f"http://localhost:3001/setupbluetooth/"
        data = {"macs": goodMacs}
        data_json = json.dumps(data)
        headers = {"Content-Type": "application/json"}
        response_json = requests.post(url, data=data_json, headers=headers)
        if response_json.status_code != 200:
            if tries >= 25:
                logger.error("Unable to initialize bluetooth, giving up")
                return 0
            logger.error("Unable to initialize bluetooth, trying again after 5 seconds")
            time.sleep(5)
            
            return initialize_bluetooth(tries+1)
        logger.info("Bluetooth synced with server")
        return response_json
    except Exception as e:
        logger.error("Failed, trying again %s", e)
        time.sleep(5)
        return initialize_bluetooth(tries+1)

def update_bluetooth_status(mac: str, status: str):
    url = f"http://localhost:3001/bluetooth/"
    data = {"mac": mac, "status": status, "battery": ""}
    data_json = json.dumps(data)
    headers = {"Content-Type": "application/json"}
    response_json = requests.post(url, data=data_json, headers=headers)

async def start_discovering():
    initialize_bluetooth()
    while True:
        logger.info("Scanning")
        devices = await BleakScanner.discover(timeout=5.0)

        for d in devices:
            if d.address in goodMacs:
                logger.info("Device found %s", d.address)
                update_bluetooth_status(d.address, "connecting")
                try:
                    client = BleakClient(d, timeout=5,)
                    await client.connect()
                    update_bluetooth_status(d.address, "connected")
                    def callback(_, data):
                        stringdata = data.decode("utf-8")
                        values = stringdata.split("&")
                        controllernumber = values[0]
                        batteryLevel = values[1]
                        temperature = values[2]
                        logger.info("%s received %r %r %r", d.address, controllernumber, batteryLevel, temperature)
                        url = f"http://localhost:3001/buzz/{controllernumber}"
                        data = {"batteryLevel": batteryLevel, "temperature": temperature}
                        data_json = json.dumps(data)
                        headers = {"Content-Type": "application/json"}
                        response_json = requests.post(url, data=data_json, headers=headers)

                    await client.start_notify(NOTIFY_UUID, callback)
                except ValueError as e:
                    logger.error("Error: %s", e)
                    update_bluetooth_status(d.address, "disconnected")
                    continue
                except:
                    update_bluetooth_status(d.address, "disconnected")
                    continue
        await asyncio.sleep(2)

asyncio.run(start_discovering())