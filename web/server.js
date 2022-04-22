const express = require('express')
const next = require('next')
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors')

const port = 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()


app.prepare().then(() => {
    const server = express()

    server.use(cors())

    server.use('/externalApi', createProxyMiddleware({
        target: dev ? "http://localhost:81" : "http://188.166.126.190:81",
        secure: false,
        changeOrigin: true,
        pathRewrite: {
            [`^/externalApi/*`]: '',
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