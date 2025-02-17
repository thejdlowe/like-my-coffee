print("Hello World!")
import board, time # board dependency
import digitalio
import os
import ssl
import adafruit_requests
import microcontroller
# import wifi
import socketpool
from adafruit_debouncer import Button

print("Starting", board.GP5)
light_number_redcable = 13

button_pin = digitalio.DigitalInOut(board.GP5)
button_pin.switch_to_input(pull=digitalio.Pull.DOWN)
# button = Button(button_pin, long_duration_ms=5000, value_when_pressed=True)

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
        print(button_pin.value)
        time.sleep(0.5)
        #button.update()
        #if button.short_count:
        #    print("Short")
        #if button.long_press:
        #    print("Long")
except Exception as e:
    print("Error:\n", str(e))
    print("Resetting microcontroller in 10 seconds")
    time.sleep(10)
    microcontroller.reset()
