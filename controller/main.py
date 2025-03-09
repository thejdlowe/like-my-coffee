import aioble
import bluetooth
from machine import ADC, Pin
from picozero import pico_temp_sensor, pico_led
import asyncio
import random
import json

with open("settings.json") as f:
    config = json.load(f)

controllernumber = config["CONTROLLER_NUMBER"]

button_pin = 18
button_pin_object = Pin(button_pin, Pin.IN, Pin.PULL_UP)

# Define UUIDs for the service and characteristics
_SERVICE_UUID = bluetooth.UUID(0x1848)
_WRITE_CHARACTERISTIC_UUID = bluetooth.UUID(0x2A6E)  # Central writes here
_READ_CHARACTERISTIC_UUID = bluetooth.UUID(0x2A6F)   # Peripheral responds here
_KEEPALIVE_CHARACTERISTIC_UUID = bluetooth.UUID(0x2A12)

# ADC Channel 4 reads the temperature sensor
sensor_temp = ADC(4)
conversion_factor = 3.3 / 65535  # Conversion factor for ADC reading to voltage

# Function to read the internal temperature
def read_temperature():
    raw_value = sensor_temp.read_u16()
    voltage = raw_value * conversion_factor
    temperature = 27 - (voltage - 0.706) / 0.001721
    return temperature

# Show the MAC address for the current Pico
ble = bluetooth.BLE()
ble.active(True)
_, mac_address = ble.config('mac')
formatted_mac = ':'.join(f'{b:02X}' for b in mac_address)
print(f"Bluetooth MAC Address for this device is: {formatted_mac}")
print(f"Controller registered as {controllernumber}")
ble.active(False)
ble = None

IAM = "Peripheral"

# Bluetooth parameters
BLE_NAME = "Like My Coffee Controller" # f"{IAM}"  # Dynamic name for the device
BLE_SVC_UUID = _SERVICE_UUID
BLE_APPEARANCE = 0x0300
BLE_ADVERTISING_INTERVAL = 2000

# state variables
message_count = 0

def encode_message(message):
    """Encode a message to bytes."""
    return message.encode('utf-8')

def decode_message(message):
    """Decode a message from bytes."""
    return message.decode('utf-8')

being_pressed = False
async def check_button(connection, write_characteristic):
    while True:
        try:
            is_pressed = button_pin_object.value()
            if is_pressed == 0:
                if being_pressed == False:
                    being_pressed = True
                    msg = encode_message("0")
                    message = f"{controllernumber}&{random.randint(1,2_000_000_000)}".encode('utf-8')
                    write_characteristic.write(message)

                    print(f"Sent data {message}")
            else:
                being_pressed = False
            await asyncio.sleep(0.1)
        except Exception as e:
            print(f"Error while sending data: {e}")
            continue

ble_connected_status = False
async def update_led_by_status():
    while True:
        pico_led.on()
        await asyncio.sleep(1)

        if ble_connected_status == False:
            pico_led.off()
            await asyncio.sleep(1)
        await asyncio.sleep(0.1)

async def send_data_task(connection, write_characteristic):
    """Send data to the central device."""
    global message_count
    while True:
        message = f"{read_temperature()}°C"
        # print(f"Sending: {message}")

        try:
            msg = encode_message(message)
            write_characteristic.write(msg)  # Peripheral writes data here
            print(f"Sending: {message}")
            await asyncio.sleep(1)
        except Exception as e:
            print(f"Error while sending data: {e}")
            continue

async def receive_data_task(read_characteristic):
    """Receive data from the central device."""
    while True:
        try:
            # This blocks until new data is available
            data = read_characteristic.read()

            if data:
                print(f"Received: {decode_message(data)}")
                await asyncio.sleep(1)
        except Exception as e:
            print(f"Error receiving data: {e}")
            break

async def setup_pico():
    tasks = [
        asyncio.create_task(run_peripheral_mode()),
        update_led_by_status()
    ]
    await asyncio.gather(*tasks)

async def run_peripheral_mode():
    """Run the peripheral mode."""
    
    # Set up the Bluetooth service and characteristics
    ble_service = aioble.Service(BLE_SVC_UUID)
    
    # Characteristic for the central to write
    write_characteristic = aioble.Characteristic(
        ble_service, _WRITE_CHARACTERISTIC_UUID,
        read=True, write=True, capture=False
    )
    
    keepalive_characteristic = aioble.Characteristic(
        ble_service, _KEEPALIVE_CHARACTERISTIC_UUID,
        read=True, write=True, capture=False
    )

    # Characteristic for the peripheral to write
    read_characteristic = aioble.Characteristic(
        ble_service, _READ_CHARACTERISTIC_UUID,
        read=True, write=True, capture=False
    )

    aioble.register_services(ble_service)

    print(f"{BLE_NAME} starting to advertise")

    while True:
        async with await aioble.advertise(
            BLE_ADVERTISING_INTERVAL, name=BLE_NAME, services=[BLE_SVC_UUID],
            appearance=BLE_APPEARANCE) as connection:
            
            global ble_connected_status
            ble_connected_status = True
            
            print(f"{BLE_NAME} connected to {connection.device}")

            # Create tasks for sending and receiving data
            tasks = [
                asyncio.create_task(send_data_task(connection, keepalive_characteristic)),
                asyncio.create_task(check_button(connection, read_characteristic))
            ]
            await asyncio.gather(*tasks)
            print(f"{IAM} disconnected")
            break

asyncio.run(setup_pico())

