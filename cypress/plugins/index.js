// @ts-check
const fs = require('fs')
const path = require('path')
const mdPreprocessor = require('@cypress/fiddle/src/markdown-preprocessor')

const imagesFolder = 'images'
try {
  fs.mkdirSync(imagesFolder)
} catch (e) {}

module.exports = (on, config) => {
  on('file:preprocessor', mdPreprocessor)

  // modify saved screenshots using
  // https://on.cypress.io/after-screenshot-api
  on('after:screenshot', (details) => {
    console.log(details) // print all details to terminal

    // here is a good change to modify the image:
    // add watermarks, text. Maybe even upload the image
    // to an external host rather than keep it in the repo

    // we could also only copy images on CI or for
    // each OS platform separately

    // we should probably NOT copy screenshots on failures

    const newPath = path.join(imagesFolder, details.name + '.png')

    return new Promise((resolve, reject) => {
      // fs.rename moves the file to the existing directory 'new/path/to'
      // and renames the image to 'screenshot.png'
      fs.rename(details.path, newPath, (err) => {
        if (err) return reject(err)

        // because we renamed and moved the image, resolve with the new path
        // so it is accurate in the test results
        resolve({ path: newPath })
      })
    })
  })
}
