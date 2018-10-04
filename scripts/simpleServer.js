const fs = require('fs')
const http = require('http')
const mime = require('mime')
const path = require('path')
const url = require('url')

module.exports.serve = function serve(options) {
  const defaultOptions = options || {}
  const basePath = defaultOptions.basePath || 'public'
  const portString = defaultOptions.port || 3000
  const port = parseInt(portString, 10)
  module.exports.port = port

  let server = http
    .createServer((req, res) => {
      console.log(`${req.method} ${req.url}`)

      const parsedUrl = url.parse(req.url)
      const sanitizePath = path
        .normalize(parsedUrl.pathname)
        .replace(/^(\.\.[\/\\])+/, '')

      let pathname = path.join(basePath, sanitizePath)

      fs.exists(pathname, exist => {
        if (!exist) {
          res.statusCode = 404
          res.end(`${pathname} not found`)
        }

        if (fs.statSync(pathname).isDirectory()) {
          pathname += '/index.html'
        }

        fs.readFile(pathname, (err, data) => {
          if (err) {
            res.statusCode = 500
            res.end(`Error getting the file: ${err}`)
          } else {
            const ext = path.parse(pathname).ext
            res.setHeader('Content-type', mime.getType(ext) || 'text/plain')
            res.end(data)
          }
        })
      })
    })
    .listen(port)

  module.exports.stop = () => {
    server.close()
  }
  console.log(`Server listenting on port ${port}`)
}
