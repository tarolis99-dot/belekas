/** @type {import('next').NextConfig} */
const nextConfig = {
  // Windows: sumažina sugadinto .next cache (ENOENT / trūkstami *.js chunk'ai) tikimybę
  webpack: (config, { dev }) => {
    if (dev) config.cache = false;
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
