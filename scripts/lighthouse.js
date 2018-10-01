const shell = require('shelljs')
const fs = require('fs')

// start up static web server
const handler = require('serve-handler')

module.exports = async (request, response) => {
  await handler(request, response, {
    public: 'public',
  })
}

// test tmp dir exists, if not create
if (!fs.existsSync('tmp')) {
  fs.mkdirSync('tmp')
}

// remove any previous lighthouse runs
if (fs.existsSync('tmp/lighthouse.json')) {
  fs.unlinkSync('tmp/lighthouse.json')
}

// run lighthouse test and output to file
shell.exec(`./node_modules/.bin/lighthouse \
http://localhost:3000 \
 --chrome-flags="--headless" \
 --quiet --output=json \
 --output-path=./tmp/lighthouse.json`)

// parse (rehydrate) json file
const lighthouseResultsText = shell.cat('./tmp/lighthouse.json')
const lighthouseJSON = JSON.parse(lighthouseResultsText)

// check for desired results
console.log(
  `Overall performance: ${lighthouseJSON.categories.performance.score}`
)
