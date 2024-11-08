module.exports = {
  apps: [
    {
      name: "pizza-delivery",
      script: "/app/app.js",
      watch: false, // Disable watch to prevent auto-restarting
      out_file: "/app/logs/out.log",
      error_file: "/app/logs/error.log",
      log_file: "/app/logs/combined.log",
      merge_logs: true,
      time: true,
      autorestart: true, // Ensure it restarts on failure, not on changes
      instances: 1,
      max_memory_restart: "1G",
    },
  ],
};
