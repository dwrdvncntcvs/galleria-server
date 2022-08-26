const multer = require("multer");

const S_TYPE = {
  DISK: "disk",
  MEMORY: "memory",
};

class ImageService {
  constructor({ storageType, name }) {
    this.storageType = storageType;
    this.name = name;
    this.storage = this.getStorage();
  }

  getStorage = () => {
    if (this.storageType === S_TYPE.DISK)
      this.storage = multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, `image/${name}s`);
        },
        filename: (req, file, cb) => {
          cb(
            null,
            file.fieldname + "-" + Date.now() + extname(file.originalname)
          );
        },
      });
    else if (this.storageType === S_TYPE.MEMORY)
      this.storage = multer.memoryStorage();
    else
      return new Error(
        `Invalid storage type: ${storageType} | Storage type can only be "disk" or "memory".`
      );
  };

  upload = (type) => {
    let uploadType = multer({ storage: this.storage });
    switch (type) {
      case "single":
        return uploadType.single(this.name);
      case "array":
        return uploadType.array(this.name);
      case "fields":
        return uploadType.fields(this.name);
      case "none":
        return uploadType.none(this.name);
      case "any":
        return uploadType.any(this.name);
      default:
        return;
    }
  };
}

module.exports = { ImageService, S_TYPE };
