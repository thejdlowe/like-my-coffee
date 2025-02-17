### print("Hello World!")
import board, time # board dependency
from digitalio import DigitalInOut, Direction, Pull
import os
import ssl
import adafruit_requests
import microcontroller
# import wifi
import socketpool
from adafruit_debouncer import Button

print("Starting")
light_number_redcable = 13

button_pin = DigitalInOut(board.GP18)
button_pin.direction = Direction.INPUT
button_pin.pull = Pull.DOWN
button = Button(button_pin, long_duration_ms=5000, value_when_pressed=True)

try:
    '''
    print("my IP addr:", wifi.radio.ipv4_address)
    
    pool = socketpool.SocketPool(wifi.radio)
    requests = adafruit_requests.Session(pool, ssl.create_default_context())
    '''
    CONTROLLER_NUMBER = os.getenv('CONTROLLER_NUMBER')
    # response = requests.get(f'http://likemycoffee.local:3001/buzz/{CONTROLLER_NUMBER}/100')
    # print("Text response: ", response.text)
    '''
    # Setup LED
    led = digitalio.DigitalInOut(board.LED)
    led.direction = digitalio.Direction.OUTPUT

    # Function to control number of flashes and flash interval 
    def flash_led(times=100, interval=1):
        """Flash the external LED rapidly a specified number of times."""
        for _ in range(times):
            led.value = True  # Turn on the LED
            time.sleep(interval)
            led.value = False  # Turn off the LED
            time.sleep(interval)
            

    # Flash the external LED 5 times rapidly
    # flash_led(100, 0.1)
    '''
    print("Whee")
    while True:
        button.update()
        if button.short_count:
            print("Short")
        if button.long_press:
            print("Long")
except Exception as e:
    print("Error:\n", str(e))
    print("Resetting microcontroller in 10 seconds")
    time.sleep(10)
    microcontroller.reset()