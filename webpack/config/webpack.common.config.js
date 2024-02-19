

/**
 * import 是es6的写法
 * webpack用的node，其规范是commonJS, module.exports/require
 * 
 * TIP: 
 * 1. webpack 本质只是打包和输入，在这个过程中，可以注册不同的插件，来完成相应的需求
 * 2. webpack 只识别js文件
 * 3. webpack.loader 的作用则转换css,img等文件资源转换，以致webpack识别
 * 4. webpack 不识别html，也没有需要识别html的意义
 */
const path = require('path');
const miniCssExtractPlugin = require('mini-css-extract-plugin');
const cleanPlugin = require('clean-webpack-plugin');
const htmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  // 指定入口文件路径
  entry: {
    // string / string[] / obj(多入口配置时使用 {[入口名]: [string/ string[]] })

    /**
     * 1. 字符串形式只能配置入口，不够灵活
     * 2. 字符串数组， ['./app.js','./b.js'] 这种方式，与 在'./app.js'中导入'./b.js'中基本一致
     * 3. 对象形式 {
     *  [chunkName]: {
     *    import: './app.js', // 指定入口文件 
     *    filename: 'main.js', // 指定output文件名
     *    
     *    // 运行时环境，每一个chunk流程中都会产生一个运行时环境
     *    // 假定 ./app.js中导入了 b.js，c.js, b.js导入了c.js；当第二次解析到c.js时，由于之前已经解析过了
     *    // 在当前运行时环境中缓存过一次 c,此时即可直接取用缓存中的，不必再重新解析一次c.js，这是构建性能优化
     *    // 也是运行时环境的作用之一
     *    // --- 承上启下 ---
     *    // 由于entry是对象，也就是说，可以存在多个 chunk；
     *    // 假定每个chunk都有一个运行时环境，如果chunk2和chunk1同时导入了 c.js， chunk1流程先走完，
     *    // 还是为了提高构建性能，设定 chunk1,chunk2的runtime为同一个，即能共享同一个运行时环境
     *  
     *    runtime: 'mainRunTime',
     * 
     *    // 与runtime的作用类似，所不同的是，mainRunTime不存在则会创建，存在则使用
     *    // 而dependOnTime 不存在，则会报错，
     *    
     *    // 此外，runtime,dependOn只能同时存在一个
     *    dependOn: 'dependOnTime',  
     *  }
     * }
     */
    'main': './app.js',
    // 'app2': './app2.js'
  },
  // 指定输出文件路径和文件名
  output: {
    // 打包输入到path文件夹下（绝对路径）
    // path: path.join(__dirname, '../dist'),
    /**
     * hash：所有文件哈希值相同，如果任意文件内容发生变化，则再次打包后，所有哈希值均改变且相同
     * chunkhash：根据不同的入口进行依赖文件解析，构建对应的chunk，生成对应的哈希值。
     * contenthash:	根据内容生成hash值，文件内容相同hash值就相同
     */
    // filename: "[name].[chunkhash:8].bundle.js"
    filename: "bundle.js"
  },
  // // 配置模块(loader)，例如：解析 ES6、CSS、图片等
  // module: {
  //   rules: [
  //     {
  //       test: /\.js$/,
  //       // loader: 'babel-loader' // 值只能是字符串
  //       /**
  //        * 数组从后向前依次执行(babel-loader类似于一个接口，
  //        * 本身调用@babel/core实现es6转es5)
  //        */
  //       use: ['babel-loader'],
  //       // use: {
  //       //   loader: 'babel-loader',
  //       //   options: {},
  //       // },
  //     },
  //     {
  //       test: /\.css$/,
  //       // style-loader将会创建style标签，并插入到html中，mini-css-extra-plugin
  //       use: [
  //         miniCssExtractPlugin.loader, 
  //         'css-loader',
  //         path.join(__dirname,'../css-log-loader.js')
  //       ]
  //     },
  //     {
  //       // 小于5k的图片在img下不会有图片文件，而是直接把图片的base64值写到html引入图片的地方
  //       // 大于5k的图片会放在img下，需要的时候通过http请求下载
  //       test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
  //       loader: 'url-loader',
  //       options: {
  //         limit: 5000,
  //         outputPath: 'images/',
  //         name: '[name].[contenthash:8].[ext]'
  //       }
  //     },
  //   ]
  // },
  // // 插件，可以完成一些特定的任务，例如打包优化、文件拷贝、代码替换等
  // plugins: [
  //   new cleanPlugin.CleanWebpackPlugin(),
  //   new miniCssExtractPlugin({
  //     filename: 'css/[name].css',
  //   }),
  //   new htmlWebpackPlugin({
  //     // 配置一个title变量，在html模板中，通过打包注入title值 <%= htmlWebpackPlugin.options.title %>
  //     title: 'study_webpack',
  //     filename: 'index.html',
  //     template: path.join(__dirname,'../index.html'),
  //     minify: {
  //       collapseWhitespace: false, // 是否移除空格换行
  //       removeComments: false
  //     },
  //   }),
  //   new webpack.DefinePlugin({
  //     'TYPE': JSON.stringify(process.env.TYPE),
  //   }),
  // ],
  // optimization: {
  //   // 配置代码分割，以实现如 “避免首屏加载了一些暂时用不到的代码”等需求
  //   splitChunks: {
  //     // chunks: 'all', // all/async/initial
  //     // minChunks: 2, // 重复被引用了两次及以上
  //     // minSize: 0, // 当某些文件过小，其实没有拆分的必要此时配置minSize以过滤
  //     cacheGroups: {
  //       vendor: {
  //         test: /[\\/]node_modules[\\/]/,
  //         filename: 'vendor.js',
  //         minChunks: 1,
  //         chunks: 'all',
  //       },
  //       // 如果c文件只被a,b文件引用，而app文件没有直接引用c文件，那么c文件并不会被单独提取，而是被打包到a,b文件中
  //       // 这里如果需要生效，则需要配置entry为多入口，且入口文件引用了公有资源
  //       common: {
  //         chunks: 'all',
  //         minChunks: 2,
  //         filename: 'common.js',
  //         minSize: 0,
  //       },
  //     }
  //   },
  // },
  // // 指定当前的构建环境，例如 development、production、none
  // /**
  //  * development: 开发模式。Webpack 会开启一些开发工具，如热更新、source map 等，用于提高开发效率。
  //  * production: 生产模式。Webpack 会对代码进行优化，如代码压缩、去除无用代码等，以提高运行性能。
  //  * none: 关闭任何默认优化选项，一般用于高度自定义的配置中。
  //  */
  // mode: 'development',
  // devServer: {
  //   port: 8000,
  //   hot: true,
  //   proxy: {
  //     // webpack-dev-server开启的node服务代替我们请求接口
  //     '/base': {
  //       target: 'http://localhost:3001',
  //       // pathRewrite: { "^/base": "/app/base" },
  //     }
  //   },
  //   // contentBase:path.resolve(__dirname,'../dist'), // webpack5已经移除该属性
  //   static:path.resolve(__dirname,'../dist'),
  //   compress: true,
  //   open: true,
  // }
}