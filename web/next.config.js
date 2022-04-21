/** @type {import('next').NextConfig} */
const env = {
  development: {
    API_URL: "http://localhost:81",
    PREDICTION_INTERVAL: 3000
  },
  production: {
    API_URL: "http://localhost:81",
    PREDICTION_INTERVAL: 3000
  }
}
const nextConfig = {
  reactStrictMode: true,
  env: process.env.NODE_ENV == "production" ? env.production : env.development
}

module.exports = nextConfig
