/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fully static site (out/) served by Firebase Hosting.
  output: "export",
  trailingSlash: true,
  turbopack: {
    root: import.meta.dirname,
  },
  images: {
    // The Next image optimiser needs a server; static export serves the source files.
    unoptimized: true,
  },
};

export default nextConfig;
