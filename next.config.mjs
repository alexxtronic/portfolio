/** @type {import('next').NextConfig} */
const nextConfig = {
  // The old work and contact pages now live as sections of the homepage.
  async redirects() {
    return [
      { source: "/work", destination: "/#work", permanent: true },
      { source: "/contact", destination: "/#hire", permanent: true },
    ];
  },
};

export default nextConfig;
