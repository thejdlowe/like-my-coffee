import asyncio
import logging
import time
from bleak import BleakClient, BleakScanner
import requests
import json
'''
devices = [
            "D8:3A:DD:76:3D:40",
            "28:CD:C1:10:AF:02",
            "D8:3A:DD:76:3D:08",
            "28:CD:C1:10:AF:5E",
            "28:CD:C1:10:AD:E6",
            "28:CD:C1:10:00:F0",
            "D8:3A:DD:76:3D:08",
            
            # Add more devices as needed
        ]
'''
async def start_discovering():
    while True:
        devices = await BleakScanner.discover(timeout=5.0)

        for d in devices:
            async with BleakClient(d) as client:
                print(client.services)
        await asyncio.sleep(10)


asyncio.run(start_discovering())