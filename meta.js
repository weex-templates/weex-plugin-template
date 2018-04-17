const path = require('path')
const fs = require('fs')

const {
  sortDependencies,
  installDependencies,
  runLintFix,
  printMessage,
  isValidPackageName
} = require('./utils')

const pkg = require('./package.json')

const templateVersion = pkg.version

const { transformBeforeRending } = require('./scenarios')

module.exports = {
  metalsmith: {
    // When running tests for the template, this adds answers for the selected scenario
    before: transformBeforeRending,
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
    name: {
      when: 'isNotTest',
      type: 'string',
      required: true,
      message: 'Project name',
    },
    description: {
      when: 'isNotTest',
      type: 'string',
      required: false,
      message: 'Project description',
      default: 'A weex project',
    },
    author: {
      when: 'isNotTest',
      type: 'string',
      message: 'Author',
    },
    weexSdkVersion: {
      when: 'isNotTest',
      type: 'list',
      message:
        'Which version of weex sdk do you want to develop based on?',
      choices: [
        {
          name: '0.18.0 (Latest)',
          value: '0.18.0',
          short: '0.18.0',
        },
        {
          name: '0.17.0',
          value: '0.17.0',
          short: '0.17.0',
        },
        {
          name: '0.16.0',
          value: '0.16.0',
          short: '0.16.0',
        },
        {
          name: '0.15.0',
          value: '0.15.0',
          short: '0.15.0',
        },
        {
          name: '0.14.0',
          value: '0.14.0',
          short: '0.14.0',
        },
        {
          name: '0.13.0',
          value: '0.13.0',
          short: '0.13.0',
        },
        {
          name: '0.12.0',
          value: '0.12.0',
          short: '0.12.0',
        }
      ]
    },
    autoInstall: {
      when: 'isNotTest',
      type: 'list',
      message:
        'Should we run `npm install` for you after the project has been created? (recommended)',
      choices: [
        {
          name: 'Yes, use NPM',
          value: 'npm',
          short: 'npm',
        },
        {
          name: 'Yes, use Yarn',
          value: 'yarn',
          short: 'yarn',
        },
        {
          name: 'No, I will handle that myself',
          value: false,
          short: 'no',
        },
      ],
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
          printMessage(data, green)
        })
        .catch(e => {
          console.log(chalk.red('Error:'), e)
        })
    } else {
      printMessage(data, chalk)
    }
  },
}
