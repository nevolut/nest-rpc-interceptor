"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
const log = message => {
    message = `\x1b[30m[ ${moment().format("YYYY/MM/DD HH:mm:ss")} ]\x1b[0m - ${message}`;
    console.log(message);
};
exports.default = log;
//# sourceMappingURL=log.js.map