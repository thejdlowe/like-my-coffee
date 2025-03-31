# Like My Coffee Scoreboard 3.0

### by J.D. Lowe

_I like my lovers like I like my coffee: open source_

<img src="https://github.com/thejdlowe/like-my-coffee-scoreboard/assets/2357370/d96b879c-cc73-4bdd-8d4b-e44f2ba1b3a0" alt="drawing" width="250"/>

This is the software needed for the application that powers the Like My Coffee scoreboard! There are some requirements:

### Hardware

1. A Raspberry Pi 5 or higher; this will act as the main hub, and will need to be connected to a TV to broadcast the scoreboard
2. At least three Raspberry Pi Pico W's, with power supplies and wiring from GP18 to a pushbutton.
3. A wifi router for the Pi to connect to.
4. A mobile device to connect to the same network as the Pi. This is for the control panel.

### Software

* React with Typescript for the Scoreboard, Player, and Control Panel displays
* node to handle the actual logic for the server (kept in `gameLogic.ts`)
* Python 3 with Bleak running to handle the bluetooth connection (this will send POST requests to the `gameLogic` file to handle communication!)

1. Do your normal Pi updates/upgrades/whatever.
2. You will need to run `npm install` on the main folder, in `client` and in `server`.
3. Your Pi will need to be set up to run the `like-my-coffee-fancy` npm start as sudo; and it also needs chromium to run shortly after those have started.
4. Your Pi will also need to run `controller/bluetooth_server.py` to maintain the bluetooth connection.

This is how my `wayfire.ini` is setup (yes this has been moved on; this was written using it, so this would need to be updated. My worry is that it's all part of how windows render; Chromium is already hard enough)

```
[autostart]
LikeMyCoffee = sudo npm run start --prefix /home/LikeMyCoffee/shared/like-my-coffee-fancy/ > coffeelog.txt
chromium = sleep 15;chromium-browser --incognito --disable-session-crashed-bubble --disable-infobars --start-fullscreen --start-maximized http://localhost:3000/
```

5. The Pico W's will need to have `main.py`, `picozero.py`, and `settings.json` moved there; you will need to update `settings.json` on each individual controller to indicate if it's player 0, 1, or 2 (we index by zero here, folks!)
6. You will need to gather the MAC addresses of each Bluetooth and save it in `controller/bluetooth_server.py` in `goodMacs`. In theory this could be made so each controller is assigned to a position on stage, like above, but hey, this way works!
7. Your mobile device will need to connect to the same network as the Pi and go to `IP of machine:3000/controlpanel`. For example, my Pi is likemycoffee.local so it goes to `http://likemycoffee.local:3000/controlpanel`
8. If you want to build your own controllers, a rudimentary buzzing in system is in place at `IP of machine:3001/buzz/{number of controller}`. Player 0 would be `http://likemycoffee.local:3001/buzz/0` for example. This is done via POST, and since the Pico W can check the temperature and battery level (by measuring VSYS), it sends these along as well.

### TO DO

1. Major code cleanups are needed to remove the USB functionality
2. I'd love for this to have some better style fixes, plus a debug mode so if a mouse is there, the user can use that to play, instead of requiring the controllers.
3. If the player buzzes in successfully, return True to the controller and give a haptic response of some kind.
4. Allow the control panel to remotely "disable" controllers.
5. Redo the bluetooth firmware for the Pico so on a side characteristic, it updates what the temperature and battery life is, so that I can get data on all controllers at any given time.
