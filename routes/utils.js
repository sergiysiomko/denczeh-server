const multer = require("multer");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");

aws.config.update({
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  accessKeyId: process.env.ACCESS_KEY_ID,
  region: process.env.AWS_STORE_REGION,
});

const s3 = new aws.S3();

const storage = multerS3({
  s3,
  bucket: process.env.AWS_STORE_NAME,
  acl: "public-read",
  metadata: function(req, file, cb) {
    cb(null, { fieldName: file.fieldname });
  },
  key: function(req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

module.exports = {
  upload,
};
