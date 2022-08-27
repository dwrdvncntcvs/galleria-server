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
