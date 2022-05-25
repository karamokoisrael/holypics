/** @type {import('next').NextConfig} */
const env = {
  global: {
    DOCS_URL: "https://documenter.getpostman.com/view/16726391/UyrAEGLQ"
  },
  development: {
    API_URL: "http://localhost:81",
    // API_URL: "https://api-holipics.karamokoisrael.tech",
    PREDICTION_INTERVAL: 3000
  },
  production: {
    API_URL: "https://api-holipics.karamokoisrael.tech",
    PREDICTION_INTERVAL: 3000
  }
}

const nextConfig = {
  reactStrictMode: true,
  env: process.env.NODE_ENV == "production" ? {...env.global, ...env.production} : {...env.global, ...env.development}
  
}

module.exports = nextConfig
