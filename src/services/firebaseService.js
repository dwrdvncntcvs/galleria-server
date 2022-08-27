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
  if (Array.isArray(file)) {
    return uploadMultiFiles(file);
  }

  if (typeof file === "object") return uploadSingleFile(file);
  else return new Error("Invalid file properties");
};

const uploadSingleFile = async (file) => {
  const { fieldname, mimetype, buffer, originalname, id } = file;
  const filename = `${fieldname}-${id}-${Date.now()}${path.extname(
    originalname
  )}`;

  const _storage = createStorage(fieldname, filename);
  await uploadBytes(_storage, buffer, { contentType: mimetype });
  return await getDownloadURL(_storage);
};

const uploadMultiFiles = async (files) => {
  const imageUrlsArr = [];

  for (let file of files) {
    const imageUrl = await uploadSingleFile(file);
    imageUrlsArr.push(imageUrl);
  }

  console.log("Image URLs: ", imageUrlsArr);

  return imageUrlsArr;
};

const removeFileFromFS = async ({ imageUrl }) => {
  const _storage = createStorageFromUrl(imageUrl);
  return await deleteObject(_storage);
};

module.exports = {
  uploadFileToFS,
  removeFileFromFS,
};
