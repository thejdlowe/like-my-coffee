import aioble
import bluetooth
from machine import ADC, Pin, freq
import network
from picozero import pico_temp_sensor, pico_led
import asyncio
import random
import json
import uwebsockets.client as ws_client
import time

# Let's save some power!
freq(100_000_000)

with open("settings.json") as f:
    config = json.load(f)

controllernumber = config["CONTROLLER_NUMBER"]
wifi_ssid = config["WIFI_SSID"]
wifi_password = config["WIFI_PASSWORD"]

socket_host = config["SOCKET_HOST"]
socket_port = config["SOCKET_PORT"]

socket_URL = f"ws://{socket_host}:{socket_port}/controller"

button_pin = 18
button_pin_object = Pin(button_pin, Pin.IN, Pin.PULL_UP)

light_pin = 13
light_pin_object = Pin(light_pin, Pin.OUT)
light_pin_object.low()

onboard_led = Pin("LED", Pin.OUT)

def connect_wifi():
    """Block until Wi-Fi is up. Blinks the onboard LED while connecting."""
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    print("calling")
    if wlan.isconnected():
        onboard_led.on()
        print(f"Connected: {wlan.ifconfig()[0]}")
        return
    print(f"Connecting to {wifi_ssid}...")
    wlan.connect(wifi_ssid, wifi_password)
    while not wlan.isconnected():
        onboard_led.toggle()
        time.sleep(0.3)
    onboard_led.on()
    print(f"Connected: {wlan.ifconfig()[0]}")

myCount = 0
async def run_socket_connection(socket):
    socket.sock.setblocking(False)
    global myCount
    while True:
        try:
            data = socket.recv()
            if data:
                print(f"Data received ({data})")
        except OSError:
            pass
        
        if myCount < 4:
            print("Test me")
            myCount += 1
            socket.send("Hi there!")
        
        await asyncio.sleep(0.05)


async def main():
    connect_wifi()
    print(f"server {socket_URL}")
    while True:
        socket = None
        try:
            socket = ws_client.connect(socket_URL)  # plain synchronous connect
            print("Connected to server")
            await run_socket_connection(socket)
        except Exception as e:
            print(f"Disconnected ({e}), retrying in 3 seconds...")
        finally:
            if socket:
                try:
                    socket.close()
                except:
                    pass
            await asyncio.sleep(3)

asyncio.run(main())