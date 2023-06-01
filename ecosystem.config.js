module.exports = {
    apps: [
        {
            name: 'onechat',
            script: './src/app.js',
            watch: true,
            env: {
                NODE_ENV: 'production'
            },
            instances: 'max',
            exec_mode: 'cluster'
        }
    ]
};
