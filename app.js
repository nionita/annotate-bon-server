// const fileHash = require('./utils/hash');

// fileHash('images/IMG_20180517_0019.jpg')
//   .then(hash => {
//     console.log('The hash is:', hash);
//   })
//   .catch(err => {
//     console.log(err);
//   });

const path = require('path');

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');
const multer = require('multer');

const scanRoutes = require('./routes/scan');

const app = express();

// Local file storage for multer
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + '-' + file.originalname);
  }
});

// File filter for multer
const fileFilter = (req, file, cb) => {
  cb(null, file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg');
}

app.use(bodyParser.json());
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));

// This will be replaced by S3 files
app.use('/images', express.static(path.join(__dirname, 'images')))

// Setup CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
})

app.use(scanRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.log(err);
  const status = err.statusCode || 500;
  const message = err.message;
  return res.status(status).json({ message: message});
});

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Listening on', process.env.PORT);
  app.listen(process.env.PORT);
})
.catch(err => {
  console.log(err);
});