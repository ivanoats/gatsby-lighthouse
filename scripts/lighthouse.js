const shell = require('shelljs')
const fs = require('fs')

// // start up static web server
// const http = require('http')
// const serveStatic = require('serve-static')
// const finalhandler = require('finalhandler')

// const serve = serveStatic('public')
// var server = http.createServer(function onRequest(req, res) {
//   serve(req, res, finalhandler(req, res))
// })

// server.listen(3000)

// console.log('server running at port 3000')

// test tmp dir exists, if not create
if (!fs.existsSync('tmp')) {
  fs.mkdirSync('tmp')
}

// remove any previous lighthouse runs
if (fs.existsSync('tmp/lighthouse.json')) {
  fs.unlinkSync('tmp/lighthouse.json')
}

// run lighthouse test and output to file
exitCode = shell.exec(`./node_modules/.bin/lighthouse \
http://localhost:3000 \
 --chrome-flags="--headless" \
 --output=json \
 --output-path=./tmp/lighthouse.json`).code

// parse (rehydrate) json file
const lighthouseResultsText = shell.cat('./tmp/lighthouse.json')
const lighthouseJSON = JSON.parse(lighthouseResultsText)

// check for desired results
console.log(
  `Overall performance: ${lighthouseJSON.categories.performance.score}`
)

shell.exit(exitCode)
