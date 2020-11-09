const fs = require("fs");

const currentDate = new Date();
const hour = currentDate.getHours();
const minutes = currentDate.getMinutes();
const seconds = currentDate.getSeconds();

module.exports.writeLog = writeLog = (message, logPath) => {
    const data = `${hour}:${minutes}:${seconds} message: ${message}}`;
    fs.appendFile(logPath, data + "\n", () => { });
};
