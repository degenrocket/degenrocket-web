# DegenRocket web client

DegenRocket-web is a UI interface for a web3 decentralized social media with native support for Degen Messaging Protocol (DMP).

## Server setup

If you don't have any experience at setting up a server, then there is a beginner-friendly guide with scripts for an automated [initial server setup](https://github.com/degenrocket/degenrocket-scripts).

---

## Install npm

*Note: nvm and npm should already be installed if you've used scripts for an automated [initial server setup](https://github.com/degenrocket/degenrocket-scripts).*

```
# install nvm to manage node versions
# https://github.com/nvm-sh/nvm

# install node v18
nvm install 18

# set node v18 as default
nvm alias default 18

# switch to node v18
nvm use 18

# update npm
npm install -g npm

# install packages
npm install
```

---

## Download the app

Download the app from the Github into the `frontend/` folder.

*Note: the app should already be downloaded if you've used scripts for an automated [initial server setup](https://github.com/degenrocket/degenrocket-scripts).*

```
git clone https://github.com/degenrocket/degenrocket-web.git frontend/
cd frontend/
```

---

## Environment

Create default `.env` file, see example `.env.example`.

*Note: the `.env` file should already be created if you've used scripts for an automated [initial server setup](https://github.com/degenrocket/degenrocket-scripts).*

```
cp .env.example .env
```

---

## Test locally

Install npm packages in the frontend folder.

```
npm install
```

Start the app.

```
npm run dev
```

Open a browser and test the app at `localhost:3000`.

*Note: press `ctrl+c` in the terminal to stop the process.* 

---

## Customization

#### Necessary settings

- Change app name, title, description, about, manifest params in `.env`.
- Add social media links in `.env`.
- Add logos (recommended sizes are 100x100, 192x192, 512x512) as `favicon.ico`, `pwa-192x192.png`, `pwa-512x512.png` into `public/` folder.

#### Optional settings

- (Optional) change colors in `.env`.
- (Optional) Show/hide contacts info in intro in `.env`.
- (Optional) Show/hide tutorial in intro in `.env`.
- (Optional) Show/hide latest comments in intro in `.env`.
- (Optional) Show/hide categories filter in feed in `.env`.
- (Optional) Show/hide guest login option in web3 modal in `.env`.

The full list of settings can be found in `./.env.example`.

#### Advanced customization

You can use completely custom intro and contacts if customization
via predefined options in `.env` is not enough.

If you've used scripts for the automated server setup, then custom
intro and contacts files should have already been created.

If you follow the manual installation, then create custom files
`CustomIntro.vue` and `CustomContacts.vue` in `components/custom/`.

If your version has example files, then you can simply copy-paste them:

```
cp components/custom/CustomContacts.example.vue components/custom/CustomContacts.vue
cp components/custom/CustomIntro.example.vue components/custom/CustomIntro.vue
```

#### Updates

Note: customized files like `components/custom/CustomIntro.vue`, `components/custom/CustomContacts.vue`, and `.env` are ignored by git, so you can customize them and they won't be changed after updating the code to a newer version with `git pull`. However, it's a good idea to back these files up.

---

## Build

Build the frontend for running in production.

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

## For developers

#### Use mock data

If you want to contribute to the UI (frontend) without the
hassle of setting up the backend and the database, then you
can use the mock data to pre-populate the client with feed
posts and latest comments by enabling this environment
variable in the `./.env` file:

```
USE_MOCKED_DATA_IF_BACKEND_IS_DOWN=true
```

Don't forget to restart the app with `npm run dev`.
