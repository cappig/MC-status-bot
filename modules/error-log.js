var { appendFile } = require('fs')
module.exports = (error) => {
    console.log(error)
    appendFile('../runtime-error.log', `[${new Date()}]: ${error.stack || error}`, (err) => {
        console.log(err)
    })
}