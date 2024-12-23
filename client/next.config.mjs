/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "www.anhngumshoa.com",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**", // Cho phép tất cả các đường dẫn từ hostname này
      },
    ],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.xlsx$/,
      use: [
        {
          loader: "file-loader",
          options: {
            name: "[path][name].[ext]",
          },
        },
      ],
    });
    return config;
  },

  reactStrictMode: false,
};

export default nextConfig;
