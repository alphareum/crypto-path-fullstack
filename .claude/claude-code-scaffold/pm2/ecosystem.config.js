module.exports = {
  apps: [
    {
      name: "api",
      script: "node",
      args: "apps/api/dist/server.js",
      env: { NODE_ENV: "development" },
      env_production: { NODE_ENV: "production" },
      watch: ["apps/api/dist"],
      error_file: "logs/api.err.log",
      out_file: "logs/api.out.log"
    },
    {
      name: "web",
      script: "node",
      args: "apps/web/server.js",
      env: { NODE_ENV: "development" },
      env_production: { NODE_ENV: "production" },
      watch: ["apps/web"],
      error_file: "logs/web.err.log",
      out_file: "logs/web.out.log"
    }
  ]
};
