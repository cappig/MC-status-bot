const fs = require('fs');
const moment = require('moment')
const chalk = require('chalk')

function append(text) {
    fs.appendFile('log.log', text + '\n', function (err) {
        if (err) console.error(chalk.red('Error writing logs to file: ' + err))
    })
}

module.exports = logger = {
    info: function(text) {
        let time = moment().format("YYYY-MM-DD HH:mm:ss")
        console.log(chalk.gray(`${time} [info]: `) + text)

        append(time + ' [info]: ' + text)
    },
    success: function(text) {
        let time = moment().format("YYYY-MM-DD HH:mm:ss")
        console.log(chalk.gray(`${time} [${chalk.green('success')}]: `) + text)

        append(time + ' [success]: ' + text)
    },
    error: function(text) {
        let time = moment().format("YYYY-MM-DD HH:mm:ss")
        console.error(chalk.gray(`${time} [${chalk.redBright('error')}]: `) + chalk.red(text))

        append(time + ' [error]: ' + text)
    },
    warn: function(text) {
        let time = moment().format("YYYY-MM-DD HH:mm:ss")
        console.error(chalk.gray(`${time} [${chalk.red('warn')}]: `) + text)

        append(time + ' [warn]: ' + text)
    },
}