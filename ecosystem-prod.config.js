require('dotenv').config();
const packageJson = require('./package.json');

module.exports = {
  apps: [
    {
      name: `prod-front@${packageJson.version}`,
      script: './.output/server/index.mjs',
      exec_mode: process.env.FRONTEND_PM2_PROD_EXEC_MODE,
      instances: process.env.FRONTEND_PM2_PROD_INSTANCES,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: "production",
        NITRO_PORT: parseInt(process.env.FRONTEND_PROD_PORT) || 3000,
      }
    }
  ]
}
