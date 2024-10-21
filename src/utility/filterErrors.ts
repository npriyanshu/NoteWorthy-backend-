import { ValidationError } from "express-validator"

export const filterErrors = (result:ValidationError[]) =>{
    return result.map((err)=>{
        return {[err.path]:err.msg}
    })

}
