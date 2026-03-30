const port = process.env.PORT || 3000

module.exports = {
    apps: [
        {
            name: "kokoro-site",
            script: "npm",
            args: "start",
            cwd: __dirname,
            instances: 1,
            exec_mode: "fork",
            autorestart: true,
            watch: false,
            max_memory_restart: "500M",
            env: {
                NODE_ENV: "production",
                PORT: port
            }
        }
    ]
}
