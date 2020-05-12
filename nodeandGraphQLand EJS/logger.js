var log4js = require('log4js');
var getLogger = function (name){
    if(!name){
        name = "suman poc"
    }
    return log4js.getLogger(name);
}

module.exports={
    getLogger:getLogger
}