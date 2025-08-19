import mongoose from "mongoose";

const UserSchema=new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique:true
    },
     email:{
        type: String,
        required: true,
        unique:true
    },
    password:{
        type: String,
        required: true,
        unique:true
    },
    avatar:{
        type: String,
        default:"https://i.pinimg.com/736x/62/01/0d/62010d848b790a2336d1542fcda51789.jpg"
    },
})

const User = mongoose.model('User', UserSchema);

export default User;