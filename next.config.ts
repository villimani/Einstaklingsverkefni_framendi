/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api-einstaklingsverkefni-veff2.onrender.com/:path*',
      },
    ];
  },
  images: {
    domains: ['res.cloudinary.com'],
  }
};

module.exports = nextConfig;
