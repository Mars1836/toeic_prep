/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["picsum.photos", "www.anhngumshoa.com", "storage.googleapis.com"],
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
