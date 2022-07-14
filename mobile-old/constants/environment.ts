export default {
    // apiUrl: process.env.NODE_ENV === "development" ? 'http://192.168.1.3:8055' : 'api-holipics.karamokoisrael.tech',
    apiUrl: process.env.NODE_ENV === "development" ? 'http://0.0.0.0:8055' : 'api-holipics.karamokoisrael.tech',
    environment: process.env.NODE_ENV
}