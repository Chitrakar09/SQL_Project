import { asyncHandler } from "../utils/asyncHandler.js";
import { StatusCode } from "../constants.js";
import {
  registerEnrollmentService,
  getEnrollmentByIdService,
  updateEnrollmentService,
  deactivateEnrollmentService,
} from "../Services/enrollment.services.js";

const registerEnrollment = asyncHandler(async (req, res) => {
  const result = await registerEnrollmentService(req.body);
  return res.status(StatusCode.CREATED).json(result);
});

const getEnrollmentById = asyncHandler(async (req, res) => {
  const result = await getEnrollmentByIdService(req.params.id);
  return res.status(StatusCode.SUCCESS).json(result);
});

const updateEnrollment = asyncHandler(async (req, res) => {
  const result = await updateEnrollmentService(req.params.id, req.body);
  return res.status(StatusCode.SUCCESS).json(result);
});

const deactivateEnrollment = asyncHandler(async (req, res) => {
  const result = await deactivateEnrollmentService(req.params.id);
  return res.status(StatusCode.SUCCESS).json(result);
});

const getStudentsOfDepartment=asyncHandler(async(req,res)=>{
  const result = await getStudentsOfDepartmentService(req.params);
  return res.status(StatusCode.SUCCESS).json(result);
})

const countStudentsPerDepartment=asyncHandler(async(req,res)=>{
  const result = await countStudentsPerDepartmentService();
  return res.status(StatusCode.SUCCESS).json(result);
})

const getStudentsByCourses=asyncHandler(async(req,res)=>{
  const result = await getStudentsByCoursesService(req.params);
  return res.status(StatusCode.SUCCESS).json(result);
})

const getStudentsWithoutEnrollment=asyncHandler(async(req,res)=>{
  const result = await getStudentsWithoutEnrollmentService(req.params);
  return res.status(StatusCode.SUCCESS).json(result);
})

export {
  registerEnrollment,
  getEnrollmentById,
  updateEnrollment,
  deactivateEnrollment,
  getStudentsOfDepartment,
  countStudentsPerDepartment,
  getStudentsByCourses,
  getStudentsWithoutEnrollment
};
