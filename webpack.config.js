const path = require('path')
const frontendDir = path.join(__dirname, 'frontend')
const outputDir = path.join(__dirname, 'public', 'scripts')

var config = {
  mode: "development",
  //devtool: "source-map",

	resolve: {
    alias: {
      "@": __dirname,
      "@components": path.join(frontendDir, 'components'),
      "@hooks": path.join(frontendDir, 'hooks'),
      "@pages": path.join(frontendDir, 'pages'),
    },
		// Add '.ts' and '.tsx' as resolvable extensions.
		extensions: ['.ts', '.tsx', '.js', '.jsx']
	},

	module: {
		rules: [
      {
				test: /\.ts(x?)$/i,
				exclude: /node_modules/,
				use: [
					{
						loader: "ts-loader"
					},
				]
      },
			{
				test: /\.s[ac]ss$/i,
				exclude: [/node_modules/, /\.global\.s[ac]css/],
				use: [
					{
            loader: 'style-loader'
          },
					{
            loader: 'css-loader',
            options: {
              sourceMap: false,
              modules: {
                compileType: 'module',
                mode: 'local',
                localIdentName: '[name]_[local]_[hash:base64:6]',
              }
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: false,
              postcssOptions: {
                ident: 'postcss',
                plugins: [
                  require('autoprefixer')
                ]
              }
            },
          },
					{
						loader: 'sass-loader',
						options: {
							implementation: require('sass')
						}
					}
				]
      },
      {
        test: /\.global\.css/,
        use: [
          'style-loader', 'css-loader'
        ]
      },
      {
				test: /tailwind\.css$/i,
				exclude: /node_modules/,
				use: [
          'style-loader',
          'css-loader',
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								ident: 'postcss',
								plugins: [
									require('tailwindcss'),
									require('autoprefixer'),
								]
							}
						}
					},
				]
			},
      {
        test: /\.(png|jpg|gif)$/i,
        type: 'asset/inline'
      },
		]
  },
}

var configReactApp = Object.assign({}, config, {
  name: "frontend",
	entry: [
		frontendDir + '/App.tsx',
	],
	output: {
		filename: 'f_bundle.js',
		path: outputDir
	},
})

module.exports = [configReactApp]