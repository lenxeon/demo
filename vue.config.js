var path = require('path')

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}


const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      alias: {
        assets: resolve('assets'),
        common: resolve('common'),
        modules: resolve('modules'),
        components: resolve('components'),
        views: resolve('views')
      }
    }
  }
})
