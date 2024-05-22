import * as moment from "moment";

const log = message => {
  message = `\x1b[30m[ ${moment().format("YYYY/MM/DD HH:mm:ss")} ]\x1b[0m - ${message}`;
  console.log(message);
};

export default log;
