import { asyncHandler } from "../utils/asyncHandler.js";
import { StatusCode } from "../constants.js";
import {
  registerEnrollmentService,
  getEnrollmentByIdService,
  getAllEnrollmentsService,
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

export {
  registerEnrollment,
  getEnrollmentById,
  updateEnrollment,
  deactivateEnrollment,
};
