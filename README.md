# Like My Coffee Scoreboard 4.0

### by J.D. Lowe

_I like my lovers like I like my coffee: open source_

<img src="https://github.com/thejdlowe/like-my-coffee-scoreboard/assets/2357370/d96b879c-cc73-4bdd-8d4b-e44f2ba1b3a0" alt="drawing" width="250"/>

This is the software needed for the application that powers the Like My Coffee scoreboard! There are some requirements:

### Hardware

1. A Raspberry Pi 5 or higher; this will act as the main hub, and will need to be connected to a TV to broadcast the scoreboard
2. At least three Raspberry Pi Pico W's, with power supplies and wiring from GP18 to a pushbutton.
3. A wifi router for the Pi and Pico's to connect to.
4. A mobile device to connect to the same network as the Pi. This is for the control panel.
5. Tablets on the same wifi network that route to `playerdisplay/:id` as this will display the player name, pronouns, and score, plus will update when the player buzzes in.

### Software

- React with Typescript for the Scoreboard, Player, and Control Panel displays
- node to handle the actual logic for the server (kept in `gameLogic.ts`)

1. Do your normal Pi updates/upgrades/whatever.
2. You will need to run `npm install` on the main folder, in `client` and in `server`.
3. Your Pi will need to be set up to run the `like-my-coffee` npm start as sudo; and it also needs chromium to run shortly after those have started.

This is how my `wayfire.ini` is setup (yes this has been moved on; this was written using it, so this would need to be updated. My worry is that it's all part of how windows render; Chromium is already hard enough)

```
[autostart]
LikeMyCoffee = sudo npm run start --prefix /home/LikeMyCoffee/shared/like-my-coffee-fancy/ > coffeelog.txt
chromium = sleep 15;chromium-browser --incognito --disable-session-crashed-bubble --disable-infobars --start-fullscreen --start-maximized http://localhost:3000/
```

4. The Pico W's will need to have everything from `controller` copied to them; once there, you will need to update `settings.json` on each individual controller to indicate what color controller it is, the WIFI SSID, the WIFI Password, the websocket hostname and the websocket port.
5. Your mobile device will need to connect to the same network as the Pi and go to `IP of machine:3000/host`. For example, my Pi is likemycoffee.local so it goes to `http://likemycoffee.local:3000/host`

### TO DO

1. Set this up to use Docker images, hence this Dockerfiles on here for client and server!
2. I'd love for this to have some better style fixes, plus a debug mode so if a mouse is there, the user can use that to play, instead of requiring the controllers.
3. If the player buzzes in successfully, return True to the controller and give a haptic response of some kind.
4. Allow the control panel to remotely "disable" controllers.
