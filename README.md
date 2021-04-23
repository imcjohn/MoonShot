# Moonshot - A trading game
### Overview
Moonshot is a historical stock simulator that allows you to replay a certain stretch
 of time over an accelerated period, with start/end times and game speed being
 user defined parameters. It uses the MarketStack API on the backend in order to query
 the data without having to keep a vast quantity of historical market data locally,
 and is fully configurable through the commented parameters in moonshot.yaml
 
### Setup Guide
In order to use Moonshot, simply clone it to the server of your choice, and install the
 appropriate prereq packages using the below pip command
 ```bash
pip3 install falcon requests pyyaml numpy typing
```
After that, edit the parameters in moonshot.yaml to meet your desired game configuration,
and install gunicorn (or waitress on windows) in order to set up the web server to host it,
then launch with the below command on linux
```bash
gunicorn web_server:app
```
or for windows
```bash
waitress-serve --port=8000 web_server:app 
```
From there, we'd recommend using Nginx or a similar server in order to sit in front of 
 the python application, as a general best practice. 
 
### Game config guide
In order to manage the game, there are a few API calls you need to know. `/api/start` will start the game, and
  `/api/freeze` will end it. `/api/ranking` gives you a rank of the current players, and
  `/api/winner` returns the winning player. For a more in-depth overview of the API,
  check out api-defs.txt
  
### Credits
 Huge shoutout to Sebastian Mendez for writing the code in market_math.py to give the stocks
 intraday Brownian motion, and big thanks to the folks over at Creative Tim for making 
 the dashboard theme that was used for the frontend. If you're interested in using
 this for your own class/project/anything else, 