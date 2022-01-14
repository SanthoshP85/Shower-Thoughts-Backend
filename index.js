const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const multer = require("multer");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const router = express.Router();
const path = require("path");
const Post = require("./models/Post");
const bodyParser= require('body-parser');


app.get('/json', function(req, res) {
  console.log("GET the json");
  res
      .status(200)
      .json( {"jsonData" : true} );
});

app.get('/file', function(req, res) {
  console.log("GET the file");
  res
      .status(200)
      .sendFile(path.join(__dirname, 'index.js'));
});


dotenv.config();

mongoose.connect(
  process.env.MONGODB_URI||'mongodb+srv://Santhosh:Santhosh@cluster0.o2rbp.mongodb.net/social?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connected to MongoDB");
  }
);
app.use("/images", express.static(path.join(__dirname, "public/images")));

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => { 
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload/", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploded successfully");
  } catch (error) {
    console.error(error);
  }
});



app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);


// //Configuration
// app.use(bodyParser.json());




app.listen(process.env.PORT || 8800,() => {
  console.log("Backend server is running!");
});