/** @type {import('next').NextConfig} */
const nextConfig = {}

// module.exports = {
//     images: {
//       domains: ['apod.nasa.gov'],
//     },
//     webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
//       config.node = {
//         fs: 'empty'
//       }
//       return config
//     },
//   }

  module.exports = (phase, { defaultConfig }) => {
    return {
      ...defaultConfig,
      images: {
        domains: ['apod.nasa.gov'],
      },
      webpack: (config) => {
        config.resolve = {
          ...config.resolve,
          fallback: {
            "fs": false,
            "path": false,
            "os": false,
          }
        }
        return config
      },
      eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
      },
    }
  }