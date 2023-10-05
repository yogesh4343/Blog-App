// import User from "../models/User";
const User = require("../models/User");
const bcrypt = require("bcryptjs")

// export const getAllUser = async(req,res,next)=>{
const getAllUser = async (req, res, next) => {
  let users;

  try {
    users = await User.find();
  } catch (error) {
    await error
  }

  if (!users) {
    return res.status(404).json({ message: "No user found" });
  }else{

      
      return res.status(200).json({ users });
    }
};

// signup
const signup = async (req, res, next) => {
  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (error) {
    return console.log(error);
  }

  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

//   hashpassword 
const hashedPassword = bcrypt.hashSync(password)
  const user = new User({
    name,
    email,
    password:hashedPassword,
    blogs:[]
  });

  try {
    await user.save();
  } catch (error) {
    return console.log(error);
  }

  return res.status(201).json({ user });
};


// login 
const login = async(req,res,next)=>{
    const { email, password } = req.body;
    let existingUser;
    try {
      existingUser = await User.findOne({ email });
    } catch (error) {
      return console.log(error);
    }
  
    if (!existingUser) {
      return res.status(404).json({ message: "Cound find Userby this eml " });
    }

    // hashpassword bcrpt 
    const isPasswordCorrect = bcrypt.compareSync(password , existingUser.password)

    if(!isPasswordCorrect){
        return res.status(400).json({message:"Incorrect passwrord"})
    }
    return res.status(200).json({message:"Login Successfl" , user:existingUser})
}

module.exports = {getAllUser , signup , login};
