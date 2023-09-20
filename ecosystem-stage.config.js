require('dotenv').config();
const packageJson = require('./package.json');

module.exports = {
  apps: [
    {
      name: `stage-front@${packageJson.version}`,
      script: './.output/server/index.mjs',
      exec_mode: process.env.FRONTEND_PM2_STAGE_EXEC_MODE,
      instances: process.env.FRONTEND_PM2_STAGE_INSTANCES,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: "staging",
        NITRO_PORT: parseInt(process.env.FRONTEND_STAGE_PORT) || 3000,
      }
    }
  ]
}
