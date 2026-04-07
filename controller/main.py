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

SOCKET_HOST = config["SOCKET_HOST"]
SOCKET_PORT = config["SOCKET_PORT"]

SOCKET_URL = f"ws://{SOCKET_HOST}:{SOCKET_PORT}/controller"

button_pin = 18
button_pin_object = Pin(button_pin, Pin.IN, Pin.PULL_UP)

light_pin = 13
light_pin_object = Pin(light_pin, Pin.OUT)
light_pin_object.low()

onboard_led = Pin("LED", Pin.OUT)

# ADC Channel 4 reads the temperature sensor
sensor_temp = ADC(4)

# Function to read the internal temperature
def read_temperature():
    raw_value = sensor_temp.read_u16()
    voltage = raw_value * conversion_factor
    temperature = 27 - (voltage - 0.706) / 0.001721
    return temperature

def get_vsys() -> float:
    conversion = 3 * 3.3 / 65535
    Pin(25, mode=Pin.OUT, pull=Pin.PULL_DOWN).high()
    Pin(29, Pin.IN)
    return ADC(29).read_u16() * conversion

def connect_wifi():
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

def ensure_wifi():
    wlan = network.WLAN(network.STA_IF)
    if wlan.isconnected():
        return
    print("Wi-Fi not connected, reconnecting...")
    onboard_led.off()
    wlan.active(False)
    time.sleep(0.5)
    wlan.active(True)
    wlan.connect(WIFI_SSID, WIFI_PASSWORD)
    timeout = 50   # 50 x 0.3s = 15s max
    while not wlan.isconnected() and timeout > 0:
        onboard_led.toggle()
        time.sleep(0.3)
        timeout -= 1
    if wlan.isconnected():
        onboard_led.on()
        print("Wi-Fi reconnected: {}".format(wlan.ifconfig()[0]))
    else:
        print("Wi-Fi reconnect timed out, will retry on next loop")

async def run_socket_connection(socket):
    socket.sock.setblocking(False)
    last_button_value = 1
    wlan = network.WLAN(network.STA_IF)
    
    mac = ':'.join('{:02X}'.format(b) for b in wlan.config('mac'))
    identify = ujson.dumps({
        "event":       "identify",
        "mac":        mac,
        "controller": CONTROLLER_COLOR,
    })
    socket.send(identify)
    del identify
    print("Identified as {}".format(mac))
    
    while True:
        try:
            data = socket.recv()
            if data:
                print(f"Data received ({data})")
                
                try:
                    msg = ujson.loads(data)
                    type = msg.get("type")
                    status = msg.get("status")
                    if type == "setLights":
                        if status == True:
                            light_pin_object.high()
                        else:
                            light_pin_object.low()
                    elif type == "status":
                        update_battery()
                        payload = ujson.dumps({
                            "controller": CONTROLLER_COLOR,
                            "event": "status",
                            "battery": last_battery,
                            "mac": ':'.join('{:02X}'.format(b) for b in wlan.config('mac')),
                            "temperature": read_temperature()
                        })
                        socket.send(payload)
                        print(f"Payload sent: {payload}")
                except Exception as e:
                    print(f"Bad message: {e}")
                finally:
                    del data
        except OSError:
            pass
        
        val = button_pin_object.value()
        
        if val == 0 and last_button_val == 1:
            payload = ujson.dumps({
                "controller": CONTROLLER_COLOR,
                "event": "buzz",
                "mac": ':'.join('{:02X}'.format(b) for b in wlan.config('mac')),
            })
            socket.send(payload)
            print(f"Payload sent: {payload}")
            
        last_button_val = val
        await asyncio.sleep(0.05)

last_battery = -1
def update_battery():
    global last_battery
    wlan = network.WLAN(network.STA_IF)
    try:
        wlan.active(False)
        vsys = get_vsys()
        time.sleep(0.05)
    finally:
        Pin(29, Pin.ALT, pull=Pin.PULL_DOWN, alt=7)
        ensure_wifi()
    last_battery = vsys
    print(f"Battery voltage {last_battery}")
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
    while True:
        socket = None
        try:
            gc.collect()
            ensure_wifi()
            socket = ws_client.connect(SOCKET_URL)  # plain synchronous connect
            print(f"Connected to server {SOCKET_URL}")
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
    await asyncio.gather(
        connection_task(),
        # battery_task(),
    )

asyncio.run(main())