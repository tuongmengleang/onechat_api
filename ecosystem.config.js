// ecosystem.config.js

module.exports = {
    apps : [{
        name: 'onechat',
        script: 'src/app.js',
        watch: '.'
    }, {
        script: './service-worker/',
        watch: ['./service-worker']
    }],
}
