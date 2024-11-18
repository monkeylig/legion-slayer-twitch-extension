/** @type {import('next').NextConfig} */
const isProduction = process.env.NODE_ENV === "production";

const nextConfig = {
    reactStrictMode: true,
    output: isProduction ? 'export' : undefined,
    assetPrefix: "./",
    env: {
        STATIC_PREFIX: isProduction ? "./static" : "/static"
    },
    rewrites: isProduction ? undefined : async () => {
        return [
          {
            source: '/panel.html',
            destination: '/panel',
          },
          {
            source: '/config.html',
            destination: '/config',
          },
        ]
      },
    images: {
        loader: 'custom',
        loaderFile: './src/utilities/imageLoader.js',
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'storage.googleapis.com',
                port: '',
                pathname: '/web_rpg_resources/**',
            },
        ],
    },
    webpack(config, options) {
        config.optimization.minimize = false;
        return config;
    }
}

module.exports = nextConfig
