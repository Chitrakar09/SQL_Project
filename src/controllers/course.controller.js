import { asyncHandler } from "../utils/asyncHandler";
import { StatusCode } from "../constants";

const registerCourse= asyncHandler(async(req,res)=>{
const result = await registerCourseService(req.body);
  return res.status(StatusCode.CREATED).json(result);
})

const getCourseById = asyncHandler(async(req,res)=>{
const result = await getCourseByIdService(req.params.id);
  return res.status(StatusCode.SUCCESS).json(result);
})

const getAllCourse = asyncHandler(async(req,res)=>{
const result = await getAllCourseService(req.query);
  return res.status(StatusCode.SUCCESS).json(result);
})

const updateCourse = asyncHandler(async(req,res)=>{
const result = await updateCourseService(req.params.id,req.body);
  return res.status(StatusCode.SUCCESS).json(result);
})

const deleteCourse = asyncHandler(async(req,res)=>{
const result = await deleteCourseService(req.params.id);
  return res.status(StatusCode.SUCCESS).json(result);
})

export{registerCourse,getAllCourse,getCourseById,updateCourse,deleteCourse}