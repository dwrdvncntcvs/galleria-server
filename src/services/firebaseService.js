const { storage } = require("../utils/firebase-config");
const {
  uploadBytes,
  ref,
  getDownloadURL,
  deleteObject,
} = require("firebase/storage");
const path = require("path");

const createStorage = (fieldname, filename) =>
  ref(storage, `${fieldname}/${filename}`);

const createStorageFromUrl = (url) => ref(storage, url);

const uploadFileToFS = async ({ file }) => {
  const { fieldname, mimetype, buffer, originalname, userId } = file;
  const filename = `${fieldname}-${userId}-${Date.now()}${path.extname(
    originalname
  )}`;

  const _storage = createStorage(fieldname, filename);
  await uploadBytes(_storage, buffer, { contentType: mimetype });
  return await getDownloadURL(_storage);
};

const removeFileFromFS = async ({ imageUrl }) => {
  const _storage = createStorageFromUrl(imageUrl);
  return await deleteObject(_storage);
};

module.exports = {
  uploadFileToFS,
  removeFileFromFS,
};
