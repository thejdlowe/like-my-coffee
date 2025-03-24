import argparse
import asyncio
import contextlib
import logging
from typing import Iterable

from bleak import BleakClient, BleakScanner
import requests
import json

def update_bluetooth_status(mac: str, status: str):
    url = f"http://localhost:3001/bluetooth/"
    data = {"mac": mac, status: status, battery: ""}
    data_json = json.dumps(data)
    headers = {"Content-Type": "application/json"}
    response_json = requests.post(url, data=data_json, headers=headers)

async def connect_to_device(
    lock: asyncio.Lock,
    by_address: bool,
    macos_use_bdaddr: bool,
    name_or_address: str,
    notify_uuid: str,
):
    """
    Scan and connect to a device then print notifications for 10 seconds before
    disconnecting.

    Args:
        lock:
            The same lock must be passed to all calls to this function.
        by_address:
            If true, treat *name_or_address* as an address, otherwise treat
            it as a name.
        macos_use_bdaddr:
            If true, enable hack to allow use of Bluetooth address instead of
            UUID on macOS.
        name_or_address:
            The Bluetooth address/UUID of the device to connect to.
        notify_uuid:
            The UUID of a characteristic that supports notifications.
    """
    logging.info("starting %s task", name_or_address)

    try:
        async with contextlib.AsyncExitStack() as stack:

            # Trying to establish a connection to two devices at the same time
            # can cause errors, so use a lock to avoid this.
            async with lock:
                logging.info("scanning for %s", name_or_address)

                device = await BleakScanner.find_device_by_address(
                    name_or_address, macos=dict(use_bdaddr=macos_use_bdaddr)
                )

                logging.info("stopped scanning for %s", name_or_address)

                if device is None:
                    logging.error("%s not found", name_or_address)
                    return
                update_bluetooth_status(device, "connecting")
                client = BleakClient(device, timeout=20)

                logging.info("connecting to %s", name_or_address)

                await stack.enter_async_context(client)

                update_bluetooth_status(device, "connected")

                logging.info("connected to %s", name_or_address)

                # This will be called immediately before client.__aexit__ when
                # the stack context manager exits.
                stack.callback(logging.info, "disconnecting from %s", name_or_address)

            # The lock is released here. The device is still connected and the
            # Bluetooth adapter is now free to scan and connect another device
            # without disconnecting this one.

            def callback(_, data):
                stringdata = data.decode("utf-8")
                values = stringdata.split("&")
                controllernumber = values[0]
                batteryLevel = values[1]
                temperature = values[2]
                logging.info("%s received %r %r %r", name_or_address, controllernumber, batteryLevel, temperature)
                url = f"http://localhost:3001/buzz/{controllernumber}"
                data = {"batteryLevel": batteryLevel, "temperature": temperature}
                data_json = json.dumps(data)
                headers = {"Content-Type": "application/json"}
                response_json = requests.post(url, data=data_json, headers=headers)

            await client.start_notify(notify_uuid, callback)
            while True:
                await asyncio.sleep(10)
            #await asyncio.sleep(10.0)
            #await client.stop_notify(notify_uuid)

        # The stack context manager exits here, triggering disconnection.

        logging.info("disconnected from %s", name_or_address)
    except Exception:
        logging.exception("error with %s", name_or_address)


async def main(
    by_address: bool,
    macos_use_bdaddr: bool,
):
    lock = asyncio.Lock()
    devices = [
        #"D8:3A:DD:76:3D:40",
        "28:CD:C1:10:AF:02",
        #"D8:3A:DD:76:3D:08",
        #"28:CD:C1:10:AF:5E",
        #"28:CD:C1:10:AD:E6",
        #"28:CD:C1:10:00:F0",
        #"D8:3A:DD:76:3C:FC",
        #"D8:3A:DD:76:3D:08",
        
        # Add more devices as needed
    ]
    url = f"http://localhost:3001/setupbluetooth/"
    data = {"macs": devices}
    data_json = json.dumps(data)
    headers = {"Content-Type": "application/json"}
    response_json = requests.post(url, data=data_json, headers=headers)

    await asyncio.gather(
        *(
            connect_to_device(lock, True, macos_use_bdaddr, address, "00002A6F-0000-1000-8000-00805f9b34fb")
            for address in devices
        )
    )


if __name__ == "__main__":
    parser = argparse.ArgumentParser()

    '''
    parser.add_argument(
        "device1",
        metavar="<device>",
        help="Bluetooth name or address of first device connect to",
    )
    parser.add_argument(
        "uuid1",
        metavar="<uuid>",
        help="notification characteristic UUID on first device",
    )
    parser.add_argument(
        "device2",
        metavar="<device>",
        help="Bluetooth name or address of second device to connect to",
    )
    parser.add_argument(
        "uuid2",
        metavar="<uuid>",
        help="notification characteristic UUID on second device",
    )
    '''

    parser.add_argument(
        "--by-address",
        action="store_true",
        help="when true treat <device> args as Bluetooth address instead of name",
    )

    parser.add_argument(
        "--macos-use-bdaddr",
        action="store_true",
        help="when true use Bluetooth address instead of UUID on macOS",
    )

    parser.add_argument(
        "-d",
        "--debug",
        action="store_true",
        help="sets the log level to debug",
    )

    args = parser.parse_args()

    log_level = logging.DEBUG if args.debug else logging.INFO
    logging.basicConfig(
        level=log_level,
        format="%(asctime)-15s %(name)-8s %(levelname)s: %(message)s",
    )

    asyncio.run(
        main(
            args.by_address,
            args.macos_use_bdaddr,
            #(args.device1, args.device2),
            #(args.uuid1, args.uuid2),
        )
    )