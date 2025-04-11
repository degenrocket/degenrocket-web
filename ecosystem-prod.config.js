require('dotenv').config();
// const packageJson = require('./package.json');

module.exports = {
  apps: [
    {
      // name: `prod-front@${packageJson.version}`,
      name: process.env.FRONTEND_PM2_PROD_NAME || 'dr-prod-front',
      script: './.output/server/index.mjs',
      exec_mode: process.env.FRONTEND_PM2_PROD_EXEC_MODE || 'cluster',
      instances: process.env.FRONTEND_PM2_PROD_INSTANCES || 'max',
      autorestart: true,
      watch: false,
      max_memory_restart: process.env.FRONTEND_PM2_PROD_MAX_MEMORY_RESTART || '1G',
      env: {
        NODE_ENV: "production",
        NITRO_PORT: parseInt(process.env.FRONTEND_PROD_PORT) || 3000,
      }
    }
  ]
}
