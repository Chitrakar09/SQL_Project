import { asyncHandler } from "../utils/asyncHandler.js";
import { StatusCode } from "../constants.js";
import {
  registerStudentService,
  getStudentByIdService,
  getAllStudentsService,
  updateStudentService,
  deactivateStudentService,
} from "../Services/student.services.js";

const registerStudent = asyncHandler(async (req, res) => {
  const result = await registerStudentService(req.body);
  return res.status(StatusCode.CREATED).json(result);
});

const getStudentById = asyncHandler(async (req, res) => {
  const result = await getStudentByIdService(req.params.id);
  return res.status(StatusCode.SUCCESS).json(result);
});

const getAllStudents = asyncHandler(async (req, res) => {
  const result = await getAllStudentsService(req.query);
  return res.status(StatusCode.SUCCESS).json(result);
});

const updateStudent = asyncHandler(async (req, res) => {
  const result = await updateStudentService(req.params.id, req.body);
  return res.status(StatusCode.SUCCESS).json(result);
});

const deactivateStudent = asyncHandler(async (req, res) => {
  const result = await deactivateStudentService(req.params.id);
  return res.status(StatusCode.SUCCESS).json(result);
});


export {
  registerStudent,
  getStudentById,
  getAllStudents,
  updateStudent,
  deactivateStudent,
};
