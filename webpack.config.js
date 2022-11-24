/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

//@ts-check
'use strict';

//@ts-check
/** @typedef {import('webpack').Configuration} WebpackConfig **/

const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require('webpack');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

/** @type WebpackConfig */
const browserClientConfig = {
	context: path.join(__dirname, 'client'),
	mode: 'none',
	target: 'webworker', // web extensions run in a webworker context
	entry: {
		browserClientMain: './src/browserClientMain.ts',
	},
	output: {
		filename: '[name].js',
		path: path.join(__dirname, 'client', 'dist'),
		libraryTarget: 'commonjs',
		clean: true
	},
	resolve: {
		mainFields: ['module', 'main'],
		extensions: ['.ts', '.js'], // support ts-files and js-files
		alias: {},
		fallback: {
			path: require.resolve('path-browserify'),
		},
	},
	module: {
		rules: [
			{
				test: /\.d\.ts$/,
				type: 'asset/source'
			},
			{
				test: /\.ts$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'ts-loader',
					},
				],
			}
		],
	},
	externals: {
		vscode: 'commonjs vscode', // ignored because it doesn't exist
	},
	performance: {
		hints: false,
	},
	devtool: 'source-map',
};

/** @type WebpackConfig */
const browserServerConfig = {
	context: path.join(__dirname, 'server'),
	mode: 'none',
	target: 'webworker', // web extensions run in a webworker context
	entry: {
		browserServerMain: './src/browserServerMain.ts',
	},
	output: {
		filename: '[name].js',
		path: path.join(__dirname, 'server', 'dist'),
		libraryTarget: 'var',
		library: 'serverExportVar',
		clean: true
	},
	resolve: {
		mainFields: ['module', 'main'],
		extensions: ['.ts', '.js'],
		alias: {},
		fallback: {
			// Webpack 5 no longer polyfills Node.js core modules automatically.
			// see https://webpack.js.org/configuration/resolve/#resolvefallback
			// for the list of Node.js core module polyfills.
			'fs': false,
			'tls': false,
			'net': false,
			'child_process': false,
			path: require.resolve('path-browserify'),
			'crypto': require.resolve('crypto-browserify'),
			'stream': require.resolve('stream-browserify'),
			'http': require.resolve('stream-http'),
			'https': require.resolve('https-browserify'),
			'zlib': require.resolve('browserify-zlib'),
			'vm2': require.resolve('vm-browserify'),
			"tty": require.resolve("tty-browserify"),
			"os": require.resolve("os-browserify/browser")
		},
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'ts-loader',
					},
				],
			},
		],
	},
	externals: {
		vscode: 'commonjs vscode', // ignored because it doesn't exist
	},
	performance: {
		hints: false,
	},
	devtool: 'source-map',
	plugins: [
		new webpack.ProvidePlugin({
			Buffer: ['buffer', 'Buffer'],
		}),
		new webpack.ProvidePlugin({
			process: 'process/browser', // provide a shim for the global `process` variable
		}),
		new NodePolyfillPlugin(),
		new HtmlWebpackPlugin({
			template: "../index.html",
		}),
	],
	devServer: {
		static: "./server/dist",
		port: 5001,
	},
};

module.exports = [browserClientConfig, browserServerConfig];
