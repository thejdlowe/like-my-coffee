from machine import ADC, Pin, freq
import network
from picozero import pico_temp_sensor, pico_led
import asyncio
import ujson
import uwebsockets.client as ws_client
import time
import gc

# Let's save some power!
freq(100_000_000)

with open("settings.json") as f:
    config = ujson.load(f)

CONTROLLER_COLOR = config["CONTROLLER_COLOR"]
WIFI_SSID = config["WIFI_SSID"]
WIFI_PASSWORD = config["WIFI_PASSWORD"]
DEBUG = config["DEBUG"]

socket_host = config["SOCKET_HOST"]
socket_port = config["SOCKET_PORT"]



socket_URL = f"ws://{socket_host}:{socket_port}/controller"

button_pin = 18
button_pin_object = Pin(button_pin, Pin.IN, Pin.PULL_UP)

light_pin = 13
light_pin_object = Pin(light_pin, Pin.OUT)
light_pin_object.low()

onboard_led = Pin("LED", Pin.OUT)

def get_vsys() -> float:
    conversion = 3 * 3.3 / 65535
    Pin(25, mode=Pin.OUT, pull=Pin.PULL_DOWN).high()
    Pin(29, Pin.IN)
    return ADC(29).read_u16() * conversion

def connect_wifi():
    """Block until Wi-Fi is up. Blinks the onboard LED while connecting."""
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    if wlan.isconnected():
        onboard_led.on()
        print(f"Connected: {wlan.ifconfig()[0]}")
        return
    print(f"Connecting to {WIFI_SSID}...")
    wlan.connect(WIFI_SSID, WIFI_PASSWORD)
    while not wlan.isconnected():
        onboard_led.toggle()
        time.sleep(0.3)
    onboard_led.on()
    print(f"Connected: {wlan.ifconfig()[0]}")

async def run_socket_connection(socket):
    socket.sock.setblocking(False)
    last_button_value = 1
    wlan = network.WLAN(network.STA_IF)

    while True:
        try:
            data = socket.recv()
            if data:
                print(f"Data received ({data})")
        except OSError:
            pass
        
        val = button_pin_object.value()
        
        if val == 0 and last_button_val == 1:
            payload = ujson.dumps({
                "controller": CONTROLLER_COLOR,
                "event": "buzz",
                "battery": last_battery,
                "mac": wlan.config('mac').hex()
            })
            socket.send(payload)
            print(f"Payload sent: {payload}")
            
        last_button_val = val
        await asyncio.sleep(0.05)

last_battery = -1
def update_battery():
    global last_battery
    if DEBUG != True:
        return
    wlan = network.WLAN(network.STA_IF)
    try:
        wlan.active(False)
        vsys = get_vsys()
    finally:
        Pin(29, Pin.ALT, pull=Pin.PULL_DOWN, alt=7)
        wlan.active(True)
        # Wait for Wi-Fi to fully reconnect before returning
        timeout = 50   # 50 × 0.2s = 10s max wait
        print(f"wlan is connected {wlan.isconnected()}")
        while not wlan.isconnected() and timeout > 0:
            time.sleep(0.2)
            timeout -= 1
    last_battery = vsys
    print(f"Battery voltage {last_battery}")
    print(f"wlan is connected {wlan.isconnected()}")
    gc.collect()

BATTERY_READ_INTERVAL = 120

async def battery_task():
    update_battery()
    while True:
        await asyncio.sleep(BATTERY_READ_INTERVAL)
        print("Reading battery...")
        update_battery()

async def connection_task():
    await asyncio.sleep(1)
    connect_wifi()
    print(f"server {socket_URL}")
    while True:
        socket = None
        try:
            gc.collect()
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
            gc.collect()
            await asyncio.sleep(3)

async def main():
    gc.enable()
    gc.collect()
    await asyncio.gather(connection_task(),battery_task(),)

asyncio.run(main())