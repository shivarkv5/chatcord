const moment = require("moment")

function formatMessage(userName,message){
    return {
        userName,
        message,
        time: moment().format('LTS')
    }
}

module.exports = formatMessage;
