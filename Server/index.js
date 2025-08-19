
import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import Userrouter from './Route/user.route.js';
import authrouter from './Route/auth.route.js'
import cookieParser from 'cookie-parser';

dotenv.config();

const app=express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.use(cookieParser());


app.get('/test',(req,resp)=>{
      resp.send("Hello  Hamza Ashraaff Khokharr")
})

app.use("/api/user",Userrouter)
app.use("/api/user",authrouter)

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