const express = require('express')
const next = require('next')
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors')
const serverless = require("serverless-http")
const port = 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()


app.prepare().then(() => {
    const server = express()

    server.use(cors())

    server.use('/externalApi', createProxyMiddleware({
        target: dev ? "http://localhost:81" : "https://api-holipics.karamokoisrael.tech",
        // target: dev ? "http://188.166.126.190:84" : "http://188.166.126.190:84",
        secure: false,
        changeOrigin: true,
        pathRewrite: {
            [`^/externalApi/*`]: dev ? '' : '/',
        },
        onError(error){
            console.log(error);
        }
    }));


    server.all('*', (req, res) => {
        return handle(req, res)
    })

    

    
    server.listen(port, (err) => {
        if (err) throw err
        console.log(`> Ready on http://localhost:${port}`)
    })
})

module.exports = app
module.exports.handler = serverless(app)