# Like My Coffee Scoreboard 3.0

### by J.D. Lowe

_I like my lovers like I like my coffee: open source_

<img src="https://github.com/thejdlowe/like-my-coffee-scoreboard/assets/2357370/d96b879c-cc73-4bdd-8d4b-e44f2ba1b3a0" alt="drawing" width="200"/>

This is the software needed for the application that powers the Like My Coffee scoreboard! There are some requirements:

### Hardware

1. A Raspberry Pi 5 or higher; this will act as the main hub, and will need to be connected to a TV to broadcast the scoreboard
2. At least three Raspberry Pi Pico W's, with power supplies and wiring from GP18 to a pushbutton.
3. A wifi router for the Pi to connect to.
4. A mobile device to connect to the same network as the Pi. This is for the control panel.

### Software

1. Do your normal Pi updates/upgrades/whatever.
2. You will need to run `npm install` on the main folder, in `client`, in `server`, and in `controller`.
3. Your Pi will need to be set up to run the `like-my-coffee-fancy` npm start as sudo; same for npm run bluetooth, and it also needs chromium to run shortly after those have started.

This is how my `wayfire.ini` is setup (yes this has been moved on; this was written using it, so this would need to be updated. My worry is that it's all part of how windows render; Chromium is already hard enough)

```
[autostart]
LikeMyCoffee = sudo npm run start --prefix /home/LikeMyCoffee/shared/like-my-coffee-fancy/ > coffeelog.txt
LMCBluetooth = sudo npm run bluetooth --prefix /home/LikeMyCoffee/shared/like-my-coffee-fancy/ > bluetoothlogs.txt
chromium = sleep 15;chromium-browser --incognito --disable-session-crashed-bubble --disable-infobars --start-fullscreen --start-maximized http://localhost:3000/
```

4. The Pico W's will need to have `main.py` and `settings.json` moved there; you will need to update `settings.json` on each individual controller to indicate if it's player 0, 1, or 2 (we index by zero here, folks!)
5. You will need to gather the MAC addresses of each Bluetooth and save it in `controller/index.js` in `goodMacs`. In theory this could be made so each controller is assigned, like above, but hey, this way works!
6. Your mobile device will need to connect to the same network as the Pi and go to `IP of machine:3000/controlpanel`. For example, my Pi is likemycoffee.local so it goes to `http://likemycoffee.local:3000/controlpanel`
7. If you want to build your own controllers, a rudimentary buzzing in system is in place at `IP of machine:3001/buzz/{number of controller}`. Player 0 would be `http://likemycoffee.local:3001/buzz/0` for example.

### TO DO

1. Major code cleanups are needed to remove the USB functionality
2. I'd love for this to have some better style fixes, plus a debug mode so if a mouse is there, the user can use that to play, instead of requiring the IR controllers.
3. Individual player screens to mount to the front of pedestals that will reflect the current player's name, pronouns, and their score. This is already in progress but as of March 4, 2025, it is not usable.
4. Style it up, baby!
5. If the player buzzes in successfully, return True to the controller and give a haptic response of some kind.
