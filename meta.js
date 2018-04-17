const path = require('path')
const fs = require('fs')

// const {
//   sortDependencies,
//   installDependencies,
//   runLintFix,
//   printMessage,
// } = require('./utils')
const pkg = require('./package.json')

const templateVersion = pkg.version

const { addTestAnswers } = require('./scenarios')

module.exports = {
  metalsmith: {
    // When running tests for the template, this adds answers for the selected scenario
    before: addTestAnswers
  },
  helpers: {
    if_or(v1, v2, options) {

      if (v1 || v2) {
        return options.fn(this)
      }
      console.log(Object.keys(options))
      return options.inverse(this)
    },
    template_version() {
      return templateVersion
    },
  },
  prompts: {
    iOSProjectName: {
      when: 'isNotTest',
      type: 'string',
      required: true,
      message: 'please confirm Android Project Name',
      default: iOSProjectName
    },
    AndroidProjectName: {
      when: 'isNotTest',
      type: 'string',
      required: true,
      message: 'please confirm iOS Project Name',
      default: AndroidProjectName
    }
  },
  filters: {},
  complete: function(data, { chalk }) {
    const green = chalk.green

    sortDependencies(data, green)

    const cwd = data.dest ? data.dest : path.join(process.cwd(), data.inPlace ? '' : data.destDirName)

    if (data.autoInstall) {
      installDependencies(cwd, data.autoInstall, green)
        .then(() => {
          // printMessage(data, green)
        })
        .catch(e => {
          console.log(chalk.red('Error:'), e)
        })
    } else {
      // printMessage(data, chalk)
    }
  },
}
