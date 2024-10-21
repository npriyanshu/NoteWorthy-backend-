import { NextFunction,Request,Response } from "express";
import User, { IUser } from "../models/userModel.js";
import { validationResult } from "express-validator";
import { filterErrors } from "../utility/filterErrors.js";

export const getUsers =  async(req:Request, res:Response,next:NextFunction)=>{

    // const users:string[] = ['a','c','d'
    // ];

    let users:IUser[] = await User.find({});
    console.log(users)


    res.json({
        success:true,
        users
    })

}


export const createUser = async(req:Request, res:Response)=>{

    // validating email
    const result = validationResult(req);

    
    if (!result.isEmpty()) {
    //   console.log('Failed validation result :',result.array());
    const errors = filterErrors(result.array());
    res.json({
        errors
    });

    return;

    }
    const {name,email} = req.body;

    // await User.create({
    //     name,
    //     email
    // });

     res.json({
        success:true,
        message:'User created successfully'
    })

}