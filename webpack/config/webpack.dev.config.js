const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common.config');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

console.log('type:',process.env.TYPE);
const plugins = process.env.TYPE === 'analyze' ? ([
  new BundleAnalyzerPlugin(),
]) : undefined;

module.exports = merge(commonConfig,{
  mode: 'development',
  devtool: 'eval-cheap-source-map',
  plugins: plugins,
})