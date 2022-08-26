const { storage } = require("../utils/firebase-config");
const { uploadBytes, ref, getDownloadURL } = require("firebase/storage");
const path = require("path");

const createStorage = (fieldname, filename) =>
  ref(storage, `${fieldname}/${filename}`);

const uploadFileToFS = async ({ file }) => {
  const { fieldname, mimetype, buffer, originalname, userId } = file;
  const filename = `${fieldname}-${userId}-${Date.now()}${path.extname(
    originalname
  )}`;

  const _storage = createStorage(fieldname, filename);
  console.log(_storage);
  await uploadBytes(_storage, buffer, { contentType: mimetype });
  return await getDownloadURL(_storage);
};

module.exports = {
  uploadFileToFS,
};
