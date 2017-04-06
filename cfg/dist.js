'use strict';

let path = require('path');
let webpack = require('webpack');

let baseConfig = require('./base');
let defaultSettings = require('./defaults');

// Add needed plugins here
let BowerWebpackPlugin = require('bower-webpack-plugin');

let config = Object.assign({}, baseConfig, {
  entry: path.join(__dirname, '../src/index'),
  cache: false,
  devtool: 'sourcemap',
  plugins: [
    new webpack.optimize.DedupePlugin(),//用来检测相似的文件或者文件中重复的内容，将冗余在output中消除掉 DedupePlugin
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    }),
    new BowerWebpackPlugin({
      searchResolveModulesDirectories: false
    }),
    new webpack.optimize.UglifyJsPlugin(),//压缩输出的js的代码
    new webpack.optimize.OccurenceOrderPlugin(),//按照引用频度来排序个个模块，引用越频繁id值就越短已达到缩小文件大小的效果
    new webpack.optimize.AggressiveMergingPlugin(), //用来优化代码段，提取相似的代码等
    new webpack.NoErrorsPlugin()//保证编译过程不能出错

  ],
  module: defaultSettings.getDefaultModules()
});

// Add needed loaders to the defaults here
config.module.loaders.push({
  test: /\.(js|jsx)$/,
  loader: 'babel',
  include: [].concat(
    config.additionalPaths,
    [ path.join(__dirname, '/../src') ]
  )
});

module.exports = config;
