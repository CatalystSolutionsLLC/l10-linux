# pi-api

A tiny Express API that serves live system info from your Raspberry Pi.
Built for the Catalyst IT Linux class.

## Setup

```bash
git clone https://github.com/YOUR_USERNAME/pi-api
cd pi-api
npm install
node app.js
```

## Endpoints

Open a second terminal window and try these:

```bash
# Basic health check
curl http://localhost:3000/health

# Full system info
curl http://localhost:3000/info

# Pretty-printed JSON
curl http://localhost:3000/info | python3 -m json.tool
```

## Running in the background

```bash
# Start detached
node app.js &

# Check it's running
jobs
ps aux | grep node

# Kill it when done
kill $(pgrep node)
```

## Stop the server

If running in the foreground: `Ctrl+C`
