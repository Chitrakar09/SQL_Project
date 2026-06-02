import { apiError } from "./apiError.js"
import { StatusCode } from "../constants.js";

const asyncHandler = (fn)=> async(req,res,next)=>{
    try {
        await fn(req,res,next);
    } catch (error) {
        console.error(error)
        res.status(error.statusCode || StatusCode.INTERNAL_SERVER_ERROR).json(new apiError(error.statusCode || StatusCode.INTERNAL_SERVER_ERROR,error.message || "Internal Server Error"))
    }
}

export {asyncHandler};