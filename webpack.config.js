const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const path = require('path');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

// Optimization
const optimization = () => {
	const config = {
		splitChunks: {
			chunks: 'all',
		},
	};

	if (isProd) {
		config.minimizer = [
			new OptimizeCssAssetsPlugin(),
			new TerserWebpackPlugin(),
		];
	}

	return config;
};

// Filename
const fileName = ext => (isDev ? `[name].${ext}` : `[name].[hash].${ext}`);

// Css loaders
const cssLoaders = extra => {
	const loaders = [
		{
			loader: MiniCssExtractPlugin.loader,
			options: {
				hmr: isDev,
				reloadAll: true,
			},
		},
		'css-loader',
		{
			loader: 'postcss-loader',
			options: {
				config: {
					path: 'postcss.config.js',
				},
			},
		},
	];

	if (extra) {
		loaders.push(extra);
	}

	return loaders;
};

// Babel options
const babelOptions = preset => {
	const opts = {
		presets: ['@babel/preset-env'],
		plugins: ['@babel/plugin-proposal-class-properties'],
	};

	if (preset) {
		opts.presets.push(preset);
	}

	return opts;
};

// JS loaders
const jsLoaders = () => {
	const loaders = [
		{
			loader: 'babel-loader',
			options: babelOptions(),
		},
	];

	if (isDev) {
		loaders.push('eslint-loader');
	}

	return loaders;
};

module.exports = {
	context: path.resolve(__dirname, 'src'),
	mode: 'development',
	entry: {
		main: ['@babel/polyfill', './index.js'],
	},
	output: {
		filename: fileName('js'),
		path: path.resolve(__dirname, 'dist'),
	},
	resolve: {
		extensions: ['.js', '.css', '.scss', '.png', '.jpg'],
		alias: {
			'@': path.resolve(__dirname, 'src'),
		},
	},
	optimization: optimization(),
	devServer: {
		port: 5000,
		hot: isDev,
		watchContentBase: isDev,
	},
	devtool: isDev ? 'source-map' : '',
	plugins: [
		new HtmlWebpackPlugin({
			// template: './index.html',
			template: './pug/views/index.pug',
			minify: {
				collapseWhitespace: isProd,
				removeComments: isProd,
				removeRedundantAttributes: isProd,
			},
		}),
		new CleanWebpackPlugin(),
		new MiniCssExtractPlugin({
			filename: fileName('css'),
		}),
		new CopyWebpackPlugin({
			patterns: [
				{
					from: path.resolve(__dirname, 'src/assets'),
					to: path.resolve(__dirname, 'dist/assets'),
				},
			],
		}),
	],

	module: {
		rules: [
			{
				test: /\.css$/i,
				exclude: /node_modules/,
				use: cssLoaders(),
			},
			{
				test: /\.s[ac]ss$/i,
				use: cssLoaders('sass-loader'),
			},
			{
				test: /\.(png|jpg|jpeg|gif|svg)$/i,
				use: ['file-loader'],
			},
			{
				test: /\.(ttf|woff|woff2|eot|svg)$/i,
				use: ['file-loader'],
			},

			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: jsLoaders(),
			},
			{
				test: /\.pug$/,
				use: {
					loader: 'pug-loader',
					options: {
						pretty: isDev,
					},
				},
			},
		],
	},
};
