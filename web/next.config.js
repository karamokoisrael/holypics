/** @type {import('next').NextConfig} */
const env = {
  global: {
    DOCS_URL: "https://postman.com"
  },
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
  env: process.env.NODE_ENV == "production" ? {...env.global, ...env.production} : {...env.global, ...env.development}
  
}

module.exports = nextConfig
