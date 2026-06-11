import { asyncHandler } from "../utils/asyncHandler.js";
import { StatusCode } from "../constants.js";
import {
  registerInstructorService,
  getInstructorByIdService,
  getAllInstructorsService,
  updateInstructorService,
  deactivateInstructorService,
} from "../Services/instructor.services.js";

const registerInstructor = asyncHandler(async (req, res) => {
  const result = await registerInstructorService(req.body);
  return res.status(StatusCode.CREATED).json(result);
});

const getInstructorById = asyncHandler(async (req, res) => {
  const result = await getInstructorByIdService(req.params.id);
  return res.status(StatusCode.SUCCESS).json(result);
});

const getAllInstructors = asyncHandler(async (req, res) => {
  const result = await getAllInstructorsService(req.query);
  return res.status(StatusCode.SUCCESS).json(result);
});

const updateInstructor = asyncHandler(async (req, res) => {
  const result = await updateInstructorService(req.params.id, req.body);
  return res.status(StatusCode.SUCCESS).json(result);
});

const deactivateInstructor = asyncHandler(async (req, res) => {
  const result = await deactivateInstructorService(req.params.id);
  return res.status(StatusCode.SUCCESS).json(result);
});

const assignInstructorCourse = asyncHandler(async(req,res)=>{
    const result = await assignInstructorCourseService(req.params);
    return res.status(StatusCode.CREATED).json(result);
});

const getInstructorCourseById= asyncHandler(async()=>{
    const result = await assignInstructorCourseService(req.params.id);
    return res.status(StatusCode.SUCCESS).json(result);
});

const updateInstructorCourse= asyncHandler(async()=>{
    const result = await assignInstructorCourseService(req.params.id,req.body);
    return res.status(StatusCode.SUCCESS).json(result);
});

const getInstructorsByDepartment=asyncHandler(async(req,res)=>{
  const result = await getInstructorsByDepartmentService(req.params);
  return res.status(StatusCode.SUCCESS).json(result);
})

export {
  registerInstructor,
  getInstructorById,
  getAllInstructors,
  updateInstructor,
  deactivateInstructor,
  assignInstructorCourse,
  getInstructorCourseById,
  updateInstructorCourse,
  getInstructorsByDepartment
};
