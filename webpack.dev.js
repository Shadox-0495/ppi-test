import path from "path";
import { fileURLToPath } from "url";
import * as fs from "fs";
import Dotenv from "dotenv-webpack";
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import ESLintPlugin from "eslint-webpack-plugin";
import chokidar from "chokidar";

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
	new webpack.ProvidePlugin({
		$: "jquery",
		jQuery: "jquery",
	})
);

plugins.push(new CleanWebpackPlugin());
plugins.push(
	new Dotenv({
		path: path.resolve(__dirname, `./.env.dev`),
	})
);
plugins.push(new ESLintPlugin({ extensions: ["ts"] }));

const fileObserver = chokidar.watch(path.resolve(__dirname, "./api"), { ignored: /^\./, persistent: true, awaitWriteFinish: true });
const targetApiDir = path.resolve(__dirname, "./../php-www/ppi");

fileObserver
	.on("add", (path) => {
		const fileName = path.replace(`${__dirname}`, "");
		fs.copyFile(path, `${targetApiDir}${fileName}`, (err) => {
			if (err) throw err;
		});
	})
	.on("change", (path) => {
		const fileName = path.replace(`${__dirname}`, "");
		fs.copyFile(path, `${targetApiDir}${fileName}`, (err) => {
			if (err) throw err;
		});
	})
	.on("unlink", (path) => {
		const fileName = path.replace(`${__dirname}`, "");
		fs.unlink(`${targetApiDir}${fileName}`, (err) => {
			if (err) throw err;
		});
	});

export default {
	mode: "development",
	experiments: {
		topLevelAwait: true,
	},
	target: ["web", "es5"],
	devServer: {
		historyApiFallback: true,
		static: path.resolve(__dirname, "./"),
		open: true,
		compress: true,
		hot: true,
		port: 8081,
	},

	entry: entry,

	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "src/js/[name].js",
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
					filename: "src/assets/fonts/[base]",
				},
			},
			{
				test: /\.(sa|sc|c)ss$/,
				use: ["style-loader", "css-loader", "postcss-loader", "sass-loader"],
			},
			{
				test: /\.hbs$/,
				use: ["handlebars-loader"],
			},
			{
				test: /\.html$/,
				type: "asset/resource",
				include: [path.resolve(__dirname, "./src/assets/templates/")],
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
