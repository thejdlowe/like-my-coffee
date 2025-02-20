import network
import socket
import requests
import machine
import time
import rp2
import sys
import json
from time import sleep
from picozero import pico_temp_sensor, pico_led, LED, Button
from machine import ADC, Pin
from file_logger import Logger

logger = Logger("debug", "logfile.log")

with open("settings.json") as f:
    config = json.load(f)

controllernumber = config["CONTROLLER_NUMBER"]
controllerdebug = config["DEBUG"]
ssid = config["WIFI_SSID"]
password = config["WIFI_PASSWORD"]

light_number_redcable = 13
buttonpress_number_yellowcable = 18
button = Button(buttonpress_number_yellowcable)
button_led = LED(light_number_redcable)
temperature = 0

'''
#Pin(29, Pin.IN)
vsys = ADC(29)                      # reads the system input voltage
charging = Pin(24, Pin.IN)          # reading GP24 tells us whether or not USB power is connected
conversion_factor = 3 * 3.3 / 65535
full_battery = 4.2                  # these are our reference voltages for a full/empty battery, in volts
empty_battery = 3.0                 # the values could vary by battery size/manufacturer so you might need to adjust them
'''

def measure_vsys():
    Pin(25, Pin.OUT, value=1)
    Pin(29, Pin.IN, pull=None)
    reading = ADC(3).read_u16() * conversion_factor
    Pin(25, Pin.OUT, value=0, pull=Pin.PULL_DOWN)
    Pin(29, Pin.ALT, pull=Pin.PULL_DOWN, alt=7)
    return reading

def turn_light_on():
    if controllerdebug == True:
        pico_led.on()
    else: 
        button_led.on()

def turn_light_off():
    if controllerdebug == True:
        pico_led.off()
    else: 
        button_led.off()

def connect():
    '''
    voltage = vsys.read_u16() * conversion_factor
    percentage = 100 * ((voltage - empty_battery) / (full_battery - empty_battery))
    if percentage > 100:
        percentage = 100.00
    print(f'Voltage {voltage}')
    print(f'Charging {charging.value()}')
    print(f'Percentage {percentage}')

    
    voltage = measure_vsys()
    percentage = 100 * ((voltage - empty_battery) / (full_battery - empty_battery))
    if percentage > 100:
        percentage = 100.00
    print(f'Voltage {voltage}')
    print(f'Charging {charging.value()}')
    print(f'Percentage {percentage}')
    '''
    #Connect to WLAN
    wlan = network.WLAN(network.STA_IF)
    wlan.config(pm = 0xa11140)
    wlan.active(False)
    wlan.active(True)
    
    wlan.connect(ssid, password, channel=2)
    while wlan.isconnected() == False:
        logger.info(str(wlan.status()))
        turn_light_on()
        sleep(0.2)
        turn_light_off()
        sleep(1)
        if rp2.bootsel_button() == 1:
            sys.exit()
        print('Waiting for connection...')
    
    if wlan.status() != 3:
        print('Failed to connect to Wi-Fi')
        return False
    else:
        print('Connection successful!')
        network_info = wlan.ifconfig()
        print('IP address:', network_info[0])
        turn_light_on()
        sleep(0.5)
        turn_light_off()
        sleep(1)
        turn_light_on()
        sleep(0.5)
        turn_light_off()
        sleep(1)
        turn_light_on()
        sleep(0.5)
        turn_light_off()
        pico_led.on()
        
    '''
    voltage = vsys.read_u16() * conversion_factor
    percentage = 100 * ((voltage - empty_battery) / (full_battery - empty_battery))
    if percentage > 100:
        percentage = 100.00
    response = requests.get(f'http://likemycoffee.local:3001/buzz/{controllernumber}/{percentage}')
    print(f'{response.content} for {percentage}')
    '''

def buzzIn():
    '''
    voltage = measure_vsys()
    percentage = 100 * ((voltage - empty_battery) / (full_battery - empty_battery))
    if percentage > 100:
        percentage = 100.00
        '''
    temperature = pico_temp_sensor.temp
    response = requests.get(f'http://likemycoffee.local:3001/buzz/{controllernumber}/100')
    print(f'{response.content}')
    turn_light_on()

connect()

print("Successfully connected")
button.when_pressed = buzzIn
button.when_released = turn_light_off