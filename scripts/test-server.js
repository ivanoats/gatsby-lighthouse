const simpleServer = require('./simpleServer')
const lighthouse = require('lighthouse')
const chromeLauncher = require('chrome-launcher')
const fs = require('fs')

simpleServer.serve()

function launchChromeAndRunLighthouse(url, opts, config = null) {
  return chromeLauncher
    .launch({ chromeFlags: opts.chromeFlags })
    .then(chrome => {
      opts.port = chrome.port
      return lighthouse(url, opts, config).then(results => {
        // use results.lhr for the JS-consumeable output
        // https://github.com/GoogleChrome/lighthouse/blob/master/typings/lhr.d.ts
        // use results.report for the HTML/JSON/CSV output as a string
        // use results.artifacts for the trace/screenshots/other specific case you need (rarer)
        return chrome.kill().then(() => results.lhr)
      })
    })
}

const opts = {
  chromeFlags: ['--show-paint-rects'],
}

launchChromeAndRunLighthouse(
  `http://localhost:${simpleServer.port}`,
  opts
).then(results => {
  // check for desired results
  console.log(`Overall performance: ${results.categories.performance.score}`)
  fs.writeFileSync('tmp/lighthouse.json', JSON.stringify(results, null, 2))
  simpleServer.stop()
})
