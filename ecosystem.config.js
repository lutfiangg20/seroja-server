module.exports = {
  apps: [
    {
      name: "seroja",
      script: "server.js",
      watch: true,
      ignore_watch: ["node_modules", "logs"],
      watch_options: {
        followSymlinks: false,
      },
      error_file: "logs/error.log",
      out_file: "logs/output.log",
      log_file: "logs/combined.log",
      time: true,
    },
  ],
};
