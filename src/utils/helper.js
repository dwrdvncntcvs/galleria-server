exports.addKey = (array, value, key) => {
  return array.map((file) => {
    file[key] = value;
    return file;
  });
};
