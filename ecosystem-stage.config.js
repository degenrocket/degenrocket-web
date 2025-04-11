require('dotenv').config();
// const packageJson = require('./package.json');

module.exports = {
  apps: [
    {
      // name: `stage-front@${packageJson.version}`,
      name: process.env.FRONTEND_PM2_STAGE_NAME || 'dr-stage-front',
      script: './.output/server/index.mjs',
      exec_mode: process.env.FRONTEND_PM2_STAGE_EXEC_MODE || 'cluster',
      instances: process.env.FRONTEND_PM2_STAGE_INSTANCES || '1',
      autorestart: true,
      watch: false,
      max_memory_restart: process.env.FRONTEND_PM2_STAGE_MAX_MEMORY_RESTART || '256M',
      env: {
        NODE_ENV: "staging",
        NITRO_PORT: parseInt(process.env.FRONTEND_STAGE_PORT) || 3000,
      }
    }
  ]
}
