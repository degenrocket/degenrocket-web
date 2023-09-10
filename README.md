# DegenRocket web client

DegenRocket-web is a UI interface for a web3 decentralized social media with native support for Degen Messaging Protocol (DMP).

## Server setup

If you don't have any experience at setting up a server, then there is a beginner-friendly guide with scripts for an automated [initial server setup](https://github.com/degenrocket/degenrocket-scripts).

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

Create default `.env` file, see example `.env.example`.

```
cp .env.example .env
```

## Test locally

```
npm run dev
```

The app should run at `localhost:3000`.

## Customization

Create custom files `intro.vue` and `contacts.vue` in `components/custom/`,
see examples `components/custom/intro.example.vue`
and `components/custom/contacts.example.vue`.

```
cp components/custom/contacts.example.vue components/custom/contacts.vue
cp components/custom/intro.example.vue components/custom/intro.vue
```

Note: customized files like `components/custom/intro.vue`, `components/custom/contacts.vue`, and `.env` are ignored by git, so you can customize them and they won't be changed after updating the code to a newer version with `git pull`. However, it's a good idea to back these files up.

#### Necessary settings

- Change app name, title, description, about, manifest params in `.env`.
- Add social media links in `.env`.
- Change `favicon.ico`, `pwa-192x192.png`, `pwa-512x512.png` in `public/` folder.

#### Optional settings

- (Optional) change colors in `tailwind.config.js`.
- (Optional) change intro in `components/custom/intro.vue`.
- (Optional) change contacts in `components/custom/contacts.vue`.
- (Optional) Show/hide contacts info in intro in `.env`.
- (Optional) Show/hide tutorial in intro in `.env`.
- (Optional) Show/hide latest comments in intro in `.env`.
- (Optional) Show/hide categories filter in feed in `.env`.
- (Optional) Show/hide guest login option in web3 modal in `.env`.

## Build

```
npm run build
```

## Run production

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

