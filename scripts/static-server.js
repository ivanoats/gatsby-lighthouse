// start up static web server
const http = require('http')
const serveStatic = require('serve-static')
const finalhandler = require('finalhandler')

const serve = serveStatic('public')
var server = http.createServer(function onRequest(req, res) {
  serve(req, res, finalhandler(req, res))
})

const PORT = 3000
server.listen(PORT)
console.log(`server running on ${PORT}`)
