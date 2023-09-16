const path = require('path')
const { resolve } = path
const CopyWebpackPlugin = require('copy-webpack-plugin')
const {UnifiedWebpackPluginV5} = require('weapp-tailwindcss/webpack')
const webpack = require('webpack')
const { ConcatSource } = require('webpack-sources')
const ensurePosix = require('ensure-posix-path')
const requiredPath = require('required-path')
const fs = require('fs')
const replaceExt = require('replace-ext')
const ensurePosixPath = require('ensure-posix-path')
const glob =require('glob')

// 常量
const assetsChunkName = 'assetsChunkName'
const WXRUNTIMECHUNK = 'WxRuntimeChunk'
const ISPROD = process.env.NODE_ENV === 'production'
const SRCDIR = resolve(__dirname, 'src')

class WxRuntimeChunk {
  apply(compiler) {
    compiler.hooks.compilation.tap(WXRUNTIMECHUNK, (compilation) => {
      compilation.hooks.beforeChunkAssets.tap(WXRUNTIMECHUNK, (_) => {
        const { chunks, mainTemplate, chunkTemplate } = compilation
        const assetsChunk = [...chunks].find(
          (chunk) => chunk.name === 'assetsChunkName'
        )
        assetsChunk && chunks.delete(assetsChunk)
        webpack.javascript.JavascriptModulesPlugin.getCompilationHooks(
          compilation
        ).render.tap(WXRUNTIMECHUNK, (source, context) => {
          if (
            context.chunkGraph.getNumberOfEntryModules(context.chunk) === 0 ||
            context.chunk.hasRuntime()
          ) {
            return source
          }

          // 收集动态入口所有的依赖
          const dependences = new Set()
          context.chunk.groupsIterable.forEach((group) => {
            group.chunks.forEach((chunk) => {
              const filename = ensurePosix(
                path.relative(path.dirname(context.chunk.name), chunk.name)
              )
              if (chunk === context.chunk) return
              dependences.add(filename)
            })

          })

          // 没有依赖
          if (dependences.size == 0) return
          // 源文件拼接依赖
          let concatStr = ';'
          dependences.forEach((file) => {
            concatStr += `require('${requiredPath(file)}');`
          })
          return new ConcatSource(concatStr, source)
        })
      })
    })
    compiler.hooks.done.tap(WXRUNTIMECHUNK, (stats) => {})
  }
}


const plugins = [
  new UnifiedWebpackPluginV5({
    appType: 'native',
    customAttributes:{
      '*': [ /[A-Za-z]?[A-Za-z-]*[Cc]lass/,'hover-class' ]
    }
  }),
  new CopyWebpackPlugin({
    patterns: [
      {
        from: '**/*',
        to: '',
        globOptions: {
          ignore: ['**/*.js', '**/*.(scss|css|sass)'],
        },
        priority: 1,
      },
    ],
  }),
  new WxRuntimeChunk(),
]


// 获取入口
function getEntries(context, entry){
  const entries = Object.assign(entry)
  const props = ['pages', 'subPackages', 'usingComponents']
  const appJson = JSON.parse(fs.readFileSync(resolve(context, './app.json'), 'utf-8'))
  props.forEach((prop) => {
    const item = appJson[prop]
    if(typeof item != 'object') return
    Object.values(item).forEach((_path) => {
      // 子包拼接路径root
      if (prop == 'subPackages') {
        Object.values(_path.pages).forEach(($path) => {
          const finalPath = _path.root + $path
          if (entries[finalPath]) return
          entries[finalPath] = './' + finalPath
        })
      } else {
        if(entries[_path]) return
        entries[_path] = './' + _path
      }
    })
  })
  entries[assetsChunkName] = 
      [...Object.values(entries)].map((entry) => 
          ensurePosixPath(replaceExt(entry, '.css')))
  console.log('-------',entries)
  return entries
}

// webpack配置
const config = {
  context: SRCDIR,
  mode: ISPROD ? 'production' : 'development',
  // target: 'node',
  watchOptions: {
    aggregateTimeout: 500,
    ignored: ['**/node_modules', '**/json'],
    poll: 1000,
  },
  entry: getEntries(SRCDIR, { app: './app.js' }),
  output: {
    path: resolve(__dirname, 'dist'),
    filename: ISPROD ? '[contenthash:5].js' : '[name].js',
    chunkFilename: ISPROD ? 'async_[contenthash:5].js' : 'async_[name].js',
    globalObject: 'wx',
    clean: true,
    publicPath: '',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname,''),
    },
    extensions: ['.js', '.json'],
  },
  resolveLoader: {
    modules: ['node_modules', 'build/loaders'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader:'babel-loader',
          options:{
            sourceType: "unambiguous",
            plugins: [
              "@babel/plugin-transform-runtime"
            ],
            presets: [
              [
                "@babel/preset-env",
                {
                  useBuiltIns: "usage",
                  corejs: 3
                }
              ]
            ]
          }
        }
      },
      {
        test: /\.(sa|sc|c)ss$/,
        include: /src/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].wxss',
              context: resolve('src')
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  'tailwindcss',
                  'autoprefixer'
                ]
              }
            }
          },
          'sass-loader',
        ],
      },
      // {
      //   test: /\.(jpg|jpeg|png|webp|gif)$/,
      //   type: 'asset',
      //   generator: {
      //     filename: 'assets/[name].[ext]'
      //   },
      //   parser: {
      //     dataUrlCondition: {
      //       maxSize: 100 * 1024
      //     }
      //   }
      // }
    ],
  },
  plugins,
  optimization: {
    // tree shaking
    usedExports: true,
    // runtime code
    runtimeChunk: {
      name: 'runtime',
    },
    // code splitting
    splitChunks: {
      chunks: 'all',
      name: 'common',
      cacheGroups: {
        lottie: {
          name: 'lottie',
          test: /[\\/]lottie-miniprogram[\\/]/,
          priority: 0,
        },
      },
    }
  },
  devtool: false,
  cache: {
    type: 'filesystem'
  }
}


// config.entry = getEntries(SRCDIR, config.entry)
module.exports = config