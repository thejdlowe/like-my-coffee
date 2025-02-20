print("Hello World!")
import board, time # board dependency
from digitalio import DigitalInOut, Direction, Pull
import os
import ssl
import adafruit_requests
import microcontroller
import wifi
import socketpool
from adafruit_debouncer import Button

LIGHT_PIN = board.GP13

button_led = DigitalInOut(board.GP13)
button_led.direction = Direction.OUTPUT
button_led.value = True

CONTROLLER_NUMBER = os.getenv('CONTROLLER_NUMBER')

button_pin = DigitalInOut(board.GP18)
button_pin.direction = Direction.INPUT
button_pin.pull = Pull.UP
button = Button(button_pin, long_duration_ms=5000, value_when_pressed=True)

try:
    onboard_led = DigitalInOut(board.LED)
    onboard_led.direction = Direction.OUTPUT
    onboard_led.value = True
    if wifi.radio.ipv4_address == None:
        time.sleep(0.5)
        onboard_led.value = False
        time.sleep(0.1)
        onboard_led.value = True
        time.sleep(0.5)
        onboard_led.value = False
        time.sleep(0.1)
        onboard_led.value = True
        time.sleep(0.5)
        onboard_led.value = False
    
    print("my IP addr:", wifi.radio.ipv4_address)
    
    pool = socketpool.SocketPool(wifi.radio)
    requests = adafruit_requests.Session(pool, ssl.create_default_context())
    
    while True:
        print(button_pin.value)
        if button_pin.value == False:
            if wifi.radio.ipv4_address != None:
                response = requests.get(f'http://likemycoffee.local:3001/buzz/{CONTROLLER_NUMBER}/100')
                print("Text response: ", response.text)
        time.sleep(0.25)
        
except Exception as e:
    print("Error:\n", str(e))
    print("Resetting microcontroller in 10 seconds")
    time.sleep(10)
    microcontroller.reset()