const User=require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const registerUser=async(req,res)=>{
    try{
        const {name,email,password}=req.body;
        const existingUser=await User.findOne({email});
        if(existingUser){
            return  res.status(400).json({message:"User already exists"});
        }
        const hashedPassword=await bcrypt.hash(password,10);
        const user=await User.create({name,email,password: hashedPassword});
        res.status(201).json({message:"User registered successfully",user:user});
    } catch(error){
        res.status(400).json({message:"Failed to register user",error:error.message});
    }
};

const loginUser=async(req,res)=>{
    try{
        const {email,password}=req.body;
        const user=await User.findOne({email});
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(401).json({message:"Invalid credentials"});
        }
        const token=jwt.sign(
            { id : user._id, email: user.email, role: user.role || 'user' },
            process.env.SECRET_KEY,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );
        
        res.status(200).json({
            message:"Login successful",
            user:{name:user.name,email:user.email,role:user.role || 'user'},
            token
        });
    } catch(error){
        res.status(400).json({message:"Failed to login",error:error.message});
    }
};

module.exports={registerUser, loginUser};

