/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
  }
}

module.exports = nextConfig
