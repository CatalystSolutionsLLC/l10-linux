# install nodejs npm git
```bash

sudo apt update && sudo apt install -y nodejs npm git

node --version
npm --version
git --version


curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

# pi-api

A tiny Express API that serves live system info from your Raspberry Pi.
Built for the Catalyst IT Linux class.

## Setup

```bash
git clone https://github.com/CatalystSolutionsLLC/l10-linux.git
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
