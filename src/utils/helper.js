const moment = require("moment");

exports.addKey = (array, value, key) => {
  return array.map((file) => {
    file[key] = value;
    return file;
  });
};

exports.addIDKey = (data, value, key) => {
  data[key] = value;
  return data;
};

exports.getTimePeriod = () => {
  const timePeriod = moment().format("A");

  if (timePeriod === "AM") return "Morning";
  if (timePeriod === "PM") return "Afternoon";
  else return new Error("Invalid timePeriod", timePeriod);
};
