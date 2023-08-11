# DegenRocket web client

DegenRocket-web is a UI interface for a web3 decentralized social media with native support for Degen Messaging Protocol (DMP).

## Install

```
# update npm
npm install -g npm

# install nvm to manage node versions
# https://github.com/nvm-sh/nvm

# install node v18
nvm install 18

# set node v18 as default
nvm alias default 18

# switch to node v18
nvm use 18

# install packages
npm install
```

## Environment

Create `.env` file, see example `.env.example`.

## Test locally

```
npm run dev
```

## Customization

- Change intro in `components/custom/intro.vue`.
- Change contacts in `components/custom/contacts.vue`.
- Change app name, title, description, and manifest params in `.env`.
- Show/hide categories filter in feed in `.env`.
- Show/hide guest login option in web3 modal in `.env`.
- Change `favicon.ico`, `pwa-192x192.png`, `pwa-512x512.png` in `public/` folder.
- (optional) change colors in `tailwind.config.js`.

## Build

```
npm run build
```

## Run

Run with pm2 (after build):

```
# Install pm2
npm i pm2 -g

# To make sure app starts after reboot
pm2 startup

# Run the app
npm run prod

# Freeze a process list on reboot
pm2 save

# Check processes
pm2 list
```

## Troubleshooting

Send a message to `degenrocket` on [Session](https://getsession.org) if you need any help.

