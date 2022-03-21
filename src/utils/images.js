const { extname } = require("path");
const multer = require("multer");

class Image {
  constructor({ path, name, uploadType }) {
    this.path = path;
    this.name = name;
    this.type = uploadType;
  }

  storage = () => {
    return multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, this.path);
      },
      filename: (req, file, cb) => {
        cb(
          null,
          file.fieldname + "-" + Date.now() + extname(file.originalname)
        );
      },
    });
  };

  upload = () => {
    const storage = this.storage();
    let upload = multer({ storage });
    switch (this.type) {
      case "single":
        return upload.single(this.name);
      case "array":
        return upload.array(this.name);
      case "fields":
        return upload.fields(this.name);
      case "none":
        return upload.none(this.name);
      case "any":
        return upload.any(this.name);
      default:
        return;
    }
  };
}

module.exports = Image;
