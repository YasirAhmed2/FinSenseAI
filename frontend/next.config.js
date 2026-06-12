/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Note: axiosInstance uses NEXT_PUBLIC_API_URL directly, so no proxy rewrites needed.
  // Add rewrites here only if you want to hide the backend URL from the client.
};

module.exports = nextConfig;
