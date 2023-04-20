import path from "path";
import { fileURLToPath } from "url";
import * as fs from "fs";
import Dotenv from "dotenv-webpack";
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let entry = {};
entry["shared"] = { import: ["@features/globals.ts"] };

let plugins = fs.readdirSync(path.resolve(__dirname, "./src/ts/")).map((file) => {
	let name = file.split(".")[0];
	entry[name] = { import: `@ts/${name}.ts` };
	return new HtmlWebpackPlugin({
		pageTitle: name == "index" ? "Home" : name,
		pageName: name,
		template: path.resolve(__dirname, `./src/partials/index.hbs`),
		filename: `${name}.html`,
		chunks: ["shared", name],
	});
});

plugins.push(
	new MiniCssExtractPlugin({
		filename: "src/assets/css/[name].[contenthash].css",
		chunkFilename: "src/assets/css/[name].[contenthash].chunk.css",
	})
);

plugins.push(
	new webpack.ProvidePlugin({
		$: "jquery",
		jQuery: "jquery",
	})
);

plugins.push(new CleanWebpackPlugin());
plugins.push(
	new Dotenv({
		path: path.resolve(__dirname, `./.env.prod`),
	})
);

export default {
	mode: "production",
	experiments: {
		topLevelAwait: true,
	},
	entry: entry,

	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "src/js/[name].[contenthash].js",
	},

	optimization: {
		runtimeChunk: "single",
		splitChunks: {
			chunks: "all",
			maxInitialRequests: Infinity,
			minSize: 0,
			cacheGroups: {
				styles: {
					name: "vendors",
					test: /\.css$/,
					chunks: "all",
					minChunks: 1,
					reuseExistingChunk: true,
					enforce: true,
				},
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name(module) {
						if (module.context.indexOf("node_modules") === -1) return false;
						const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
						return `vendors/npm.${packageName.replace("@", "")}`;
					},
				},
			},
		},
	},

	module: {
		rules: [
			{
				test: /\.ts?$/,
				loader: "babel-loader",
				options: {
					presets: ["@babel/preset-typescript"],
				},
				exclude: /node_modules/,
			},
			{
				test: /\.svg$/,
				type: "asset/inline",
				include: [path.resolve(__dirname, "./src/assets/img/")],
			},
			{
				test: /\.(ico|gif|png|jpe?g)$/,
				type: "asset/resource",
				include: [path.resolve(__dirname, "./src/assets/img/")],
				generator: {
					filename: "src/assets/images/[base]",
				},
			},
			{
				test: /\.(woff(2)?|eot|ttf|otf)$/,
				type: "asset/resource",
				include: [path.resolve(__dirname, "./src/assets/fonts/")],
				generator: {
					filename(file) {
						return file.filename;
					},
				},
			},
			{
				test: /\.(sa|sc|c)ss$/,
				use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader", "sass-loader"],
			},
			{
				test: /\.hbs$/,
				use: ["handlebars-loader"],
			},
			{
				test: /\.html$/,
				type: "asset/resource",
				include: [path.resolve(__dirname, "./src/assets/templates/")],
				generator: {
					filename: "src/assets/templates/[name].[contenthash][ext]",
				},
			},
		],
	},

	resolve: {
		extensions: ["", ".js", ".jsx", ".ts", ".tsx"],
		alias: {
			"@ts": path.resolve(__dirname, "./src/ts/"),
			"@utils": path.resolve(__dirname, "./src/utils/"),
			"@assets": path.resolve(__dirname, "./src/assets/"),
			"@pages": path.resolve(__dirname, "./src/pages/"),
			"@components": path.resolve(__dirname, "./src/components/"),
			"@features": path.resolve(__dirname, "./src/features/"),
			"@sass": path.resolve(__dirname, "./src/assets/sass/"),
			"@img": path.resolve(__dirname, "./src/assets/img/"),
			handlebars: "handlebars/dist/handlebars.min.js",
		},
	},

	plugins: plugins,
};
