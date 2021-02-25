const path = require('path')
const webpack = require('webpack')
function resolve(dir) {
    return path.join(__dirname, dir)
} 
module.exports = {
    lintOnSave: true,
    chainWebpack: config => {
        config.resolve.alias
            //src
            .set('@', resolve('src'))
            .set('assets', resolve('src/assets'))
            .set('components', resolve('src/components'))
            .set('layout', resolve('src/layout'))
            .set('router', resolve('src/router'))
            .set('htp', resolve('src/require'))
            //public
            .set('img', resolve('src/static/app'))
            .set('hmg',resolve('src/static/userHeads'))
    },
    assetsDir: 'static',//静态资源目录名称
}
