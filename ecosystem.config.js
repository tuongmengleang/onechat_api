module.exports = {
  apps : [{
    name: "chat-uvacancy-api",
    script: "./src/index.js",
    instances: "max",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}