/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@aether/shared", "@aether/ai", "@aether/database"],
};

module.exports = nextConfig;
