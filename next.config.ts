/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://vef2-hopverkefni1-w64i.onrender.com/:path*',
      },
    ];
  },
  images: {
    domains: ['res.cloudinary.com'],
  }
};

module.exports = nextConfig;
