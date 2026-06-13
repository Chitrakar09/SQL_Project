import { asyncHandler } from "../utils/asyncHandler";
import { StatusCode } from "../constants";

const registerDepartment = asyncHandler(async (req, res) => {
  const result = await registerDepartmentService(req.body);
  return res.status(StatusCode.CREATED).json(result);
});

const getDepartmentById = asyncHandler(async (req, res) => {
  const result = await getDepartmentByIdService(req.params.id);
  return res.status(StatusCode.SUCCESS).json(result);
});

const getAllDepartments = asyncHandler(async (req, res) => {
  const result = await getAllDepartmentService(req.query);
  return res.status(StatusCode.SUCCESS).json(result);
});

const updateDepartments = asyncHandler(async (req, res) => {
  const result = await updateDepartmentService(req.params.id, req.body);
  return res.status(StatusCode.SUCCESS).json(result);
});

const deleteDepartment = asyncHandler(async (req, res) => {
  const result = await deleteDepartmentService(req.params.id);
  return res.status(StatusCode.SUCCESS).json(result);
});

const getDepartmentStudentCount = asyncHandler(async (req, res) => {
  const result = await getDepartmentStudentCountService();
  return res.status(StatusCode.SUCCESS).json(result);
});

export {
  registerDepartment,
  getDepartmentById,
  getAllDepartments,
  updateDepartments,
  deleteDepartment,
  getDepartmentStudentCount,
};
