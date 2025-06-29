/** @type {import('next').NextConfig} */
const nextConfig = {
  // Experimental features to handle dynamic routes better
  experimental: {
    // Disable static optimization completely for problematic routes
    staticPageGenerationTimeout: 0,
  },
  // Explicitly exclude API routes from static generation
  async generateStaticParams() {
    return []
  },
  // Configure output to handle dynamic routes
  output: 'standalone',
  // Disable static optimization for the entire app if needed
  trailingSlash: false,
  // Headers for API routes
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'X-Robots-Tag',
            value: 'noindex',
          },
        ],
      },
    ]
  },
  // Ignore build errors for faster builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false, // Keep this false to catch real errors
  },
  // Optimize images
  images: {
    unoptimized: true,
  },
  // Webpack configuration to handle dynamic imports
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Exclude problematic modules from server bundle
      config.externals = config.externals || []
      config.externals.push({
        'utf-8-validate': 'commonjs utf-8-validate',
        'bufferutil': 'commonjs bufferutil',
      })
    }
    return config
  },
}

export default nextConfig
