import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import User from "../models/userModel.js";

export const isAuthenticated = async(req:Request,res:Response,next:NextFunction)=>{

   const {token} = req.cookies;
   if(!token) {
    res.status(401).json({
        success:false,
        message:"You are not authenticated"});
        return;
   }
   const verifiedToken = jwt.verify(token,process.env.JWT_SECRET!) as jwt.JwtPayload;
   try {
    const  user = await User.findById(verifiedToken._id);

    if(user) {
        req.user = user;
        next()
    }
    else{
        res.status(401).json({success:false,message:"Invalid token no user found"});
        req.user = null;
        return;
    }
    
   } catch (error) {
    console.log(error)
    res.json({success:false,
        message:"Error authenticating",
        error});
   }

}