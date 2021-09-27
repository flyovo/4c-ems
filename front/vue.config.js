const path = require('path')

const devServerPort = process.env.PORT
// const mockServerPort = 9528
const name = '4C gate - EMS'

module.exports = {
  transpileDependencies: ['vue2-dropzone', 'excel-date-to-js', 'element-ui', 'echarts'],
  publicPath: '/',
  outputDir: './dist',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    port: devServerPort,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    progress: false
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [path.resolve(__dirname, 'src/styles/_variables.scss'), path.resolve(__dirname, 'src/styles/_mixins.scss')]
    }
  },
  css: {
    loaderOptions: {
      scss: {
        prependData: `@import "@/styles/common.scss";`
      }
    }
  },
  chainWebpack(config) {
    config.set('name', name)

    config.when(process.env.NODE_ENV === 'development', config => config.devtool('cheap-eval-source-map'))

    config.plugins.delete('progress')
    config.plugin('simple-progress-webpack-plugin').use(require.resolve('simple-progress-webpack-plugin'), [
      {
        format: 'compact'
      }
    ])

    config.when(process.env.NODE_ENV !== 'development', config => {
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial'
          },
          elementUI: {
            name: 'chunk-elementUI',
            priority: 20,
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/
          },
          commons: {
            name: 'chunk-commons',
            test: path.resolve(__dirname, 'src/components'),
            minChunks: 3,
            priority: 5,
            reuseExistingChunk: true
          }
        }
      })
      config.optimization.runtimeChunk('single')
    })
  },
  configureWebpack: {
    devtool: 'source-map',
    resolve: {
      alias: {
        '@': path.join(__dirname, 'src/')
      }
    }
  }
}
