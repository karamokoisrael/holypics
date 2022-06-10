export default {
    apiUrl: process.env.NODE_ENV === "development" ? 'http://192.168.1.3:8055' : 'api-holipics.karamokoisrael.tech',
    // apiUrl: 'https://mon-immo.laboutiik.ci',
    environment: process.env.NODE_ENV
}