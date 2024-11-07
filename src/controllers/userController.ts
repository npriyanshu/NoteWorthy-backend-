import { Request,Response } from "express";
import User, { IUser } from "../models/userModel.js";
import { validationResult } from "express-validator";
import { filterErrors } from "../utility/filterErrors.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";



export const getUser =  async(req:Request, res:Response)=>{

    // const {id} = req.params;

    // let user:IUser | null = await User.findById(id);
    // console.log(user)
    let user = req.user;

    if(user){
        res.json({
            success:true,
            user
        })
    return;
    }

    res.json({
        success:false,
        user:null
    })

}

export const deleteUser =  async(req:Request, res:Response)=>{

    const {id} = req.params;
    const userId = req?.user?._id as mongoose.Types.ObjectId;

    if(userId.toString() !== id){
        res.status(403).json({
            success:false,
            message:"You are not authorized to delete this user"
        })
        return;
    }

    let result = await User.deleteOne({"_id":id});

    if (result.deletedCount > 0) {

        req.user = null;
       
        res.clearCookie('token',{
            expires:new Date(Date.now())
        }).json({
            success:true,
            message:`User with ID ${id} deleted.`
        })
    } else {
        res.json({
            success:true,
            message:`No user found with ID ${id}.`
        })
      
    }

}


export const createUser = async(req:Request, res:Response)=>{

    // validating email
    const result = validationResult(req);

    
    if (!result.isEmpty()) {
    //   console.log('Failed validation result :',result.array());
    const errors = filterErrors(result.array());
    res.json({
        success:false,
        message:'validation errors',
        errors
    });

    return;
    }
    const {name,email,password} = req.body;

    try {
        
    // checking if user with  email already exists
    let user = await User.findOne({email});
    if(user){
        res.json({
            success:false,
            message:"This Email is already registered. Try different one!",
            errors:[
                {
                    "email":"This Email is already registered. Try different one!"
                }
            ]
            
        });
        return;
    }


    //  hashing password
    const hashedPassword = await bcrypt.hash(password,10);
    

     user = await User.create({
        name,
        email,
        password:hashedPassword    });

        // creating a token 
    const token = jwt.sign({_id:user._id as string},process.env.JWT_SECRET!)

     res.status(201).cookie("token",token,{
        expires: new Date(Date.now() + 60 * 100000),
     }).json({
        success:true,
        message:'User created successfully'
    })
    } catch (error : any) {
        res.json({
            success:false,
            message:error.errorResponse.errmsg as string,
            errors:error
        });
    }

}

export const login = async(req:Request, res:Response)=>{

    // validating email
    const result = validationResult(req);

    
    if (!result.isEmpty()) {
    //   console.log('Failed validation result :',result.array());
    const errors = filterErrors(result.array());
    res.json({
        success:false,
        errors
    });

    return;
    }


    const {email,password} = req.body;

    // checking if user exist
    let user = await User.findOne({email});

    if(!user){
        res.json({
            success:false,
            message:'User is not registered.Register first!'
            
        });
        return;
    }


    //  hashing password
    // const hashedPassword = await bcrypt.hash(password,10);
    const verifiedPassword = await bcrypt.compare(password,user.password)

       if(verifiedPassword){
         // creating a token 
    const token = jwt.sign({_id:user._id as string},process.env.JWT_SECRET!);

    // saving user in req object
    req.user = user;

    res.status(201).cookie("token",token,{
       expires: new Date(Date.now() + 60 * 100000),
    }).json({
       success:true,
       message:'Login successfully'
   })
}
 else{
    res.status(404).json({
        success:true,
        message:'Can\'t login. Wrong Password!',
        errors:[
            {
                "password":"Please enter the correct password!"
            }
        ]
    })
 }
}


export const logout = (req:Request,res:Response)=>{
    req.user = null;
    res.clearCookie('token',{
        expires:new Date(Date.now())
    });
    res.json({
        success:true,
        message:'Logged out successfully'
    })
}

export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params; // Assuming the user ID is passed in the URL

    // checking if it is the same user or not
    const userId = req?.user?._id as mongoose.Types.ObjectId;

    if(userId.toString() !== id){
        res.status(403).json({
            success:false,
            message:"You are not authorized to update this user's data"
        })
        return;
    }

    const { name, email, password } = req.body; // Get updated fields from the request body

    try {
        // Find the user by ID
        const user = await User.findById(id);
        if (!user) {
             res.status(404).json({success:false, message: "User not found" });
             return;
        }
           // Prepare update object
           const updateData: any = {
            ...(name && { name }), // Include name if provided
            // ...(email && user.email !== email && { email }), // Include email if provided
            ...(password && { password: await bcrypt.hash(password, 10) }), // Hash password if provided
        };

        // Check if the email is provided and is unique
        if (email) {
            const existingUser = await User.findOne({ email }); // Cast to IUser
            let existingUserId = existingUser && existingUser._id as mongoose.Types.ObjectId  ;
            

            if (existingUserId && existingUserId.toString() !== id) {
                 res.status(400).json({ message: "Email already in use" });
                 return;
            }
            if(user.email !== email)
            {
                updateData.email = email; 
            }
        }

          // Update user
          const result = await User.updateOne({ _id: user._id }, { $set: updateData });

          if (result.modifiedCount === 0) {
               res.status(404).json({ success:false, message: "User not found or no changes made" });
               return;
          }

          // responding with the success message
        res.status(200).json({success:true,message:"user updated successfully!"});
       
    } catch (error) {
        console.error(error);
        res.status(500).json({ success:false, message: "An error occurred", error });
    }
};