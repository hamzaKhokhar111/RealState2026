import User from "../Models/User.model.js";
import bcryptjs from 'bcryptjs'
import { errorHandler } from "../utilis/error.js";
import jwt from 'jsonwebtoken'

export const SignUp=async (req, resp, next)=>{
    const {username, email, password}=req.body;
    const hashedPassword= bcryptjs.hashSync(password, 10);
    const newUser = new User({username, email,password: hashedPassword});
   try {
    await newUser.save();
    resp.status(201).json('User Created Successfully')
   } catch(error) {
    next(error)
    // next(errorHandler(550, 'error from the function'))
}}


export const signin = async (req, resp, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User not Found !!"));

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Invalid Password"));

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);

    // password ko response se hata do (security ke liye)
    const { password: pass, ...userWithoutPassword } = validUser._doc;

    resp
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      res.cookie("access_token", token, { httpOnly: true }).status(200).json(rest);
    } else {
      const generatePassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      const hashedPassword = bcryptjs.hashSync(generatePassword, 10);

      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });

      await newUser.save();

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;

      res.cookie("access_token", token, { httpOnly: true }).status(200).json(rest);
    }
  } catch (error) {
    next(error);
  }
};


export const signOut= async(req, res, next)=>{
try {
  res.clearCookie('access_token');
  res.status(200).json('User Already Logged Out! ')
} catch(error) {
  next(error)
}
}