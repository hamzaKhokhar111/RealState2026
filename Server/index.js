import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import Userrouter from './Route/user.route.js';
import authrouter from './Route/auth.route.js'
import cookieParser from 'cookie-parser';
import listingRouter from './Route/listing.route.js'
import multer from "multer";
import path from "path";
import fs from "fs";
import cors from "cors";

dotenv.config();

const app=express();

app.use(cors());


// 📂 Folder jahan images store hongi
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // uploads folder
  },
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname)
    );
  },
});

// 🚫 File filter (sirf image allow)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = allowedTypes.test(file.mimetype);

  if (extName && mimeType) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed (jpg, png, jpeg, gif)!"));
  }
};

const upload = multer({ storage, fileFilter });

// 📤 Upload route
app.post("/api/uploads", (req, res) => {
  upload.single("image")(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // Multer ka error (size, etc.)
      return res.status(400).json({ success: false, message: "Multer Error: " + err.message });
    } else if (err) {
      // Custom filter error
      return res.status(400).json({ success: false, message: err.message });
    } else if (!req.file) {
      // Agar file hi nahi bheji gayi
      return res.status(400).json({ success: false, message: "No file uploaded!" });
    }

    // ✅ Success
    res.status(200).json({
      success: true,
      message: "Image uploaded successfully!",
      file: {
        filename: req.file.filename,
        path: `/uploads/${req.file.filename}`,
      },
    });
  });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.use(cookieParser());



app.get('/test',(req,resp)=>{
      resp.send("Hello  Hamza Ashraaff Khokharr")
})

app.use("/api/user",Userrouter)
app.use("/api/user",authrouter)
app.use('/api/listing', listingRouter)

mongoose.connect(process.env.MONGO).then(()=>{
    console.log("Connect to Mongo Db ")
}).catch((err)=>{
    console.log(err)
})
app.listen(3000, ()=>{
    console.log("Server is Running on port 3000")
})


app.use((err, req, resp , next)=> {
    const statusCode= err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return resp.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
})