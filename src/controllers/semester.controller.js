import { asyncHandler } from "../utils/asyncHandler";
import { StatusCode } from "../constants";

const createSemester = asyncHandler(async (req, res) => {
  const result = await registerSemesterService(req.body);
  return res.status(StatusCode.CREATED).json(result);
});

const getSemesterById = asyncHandler(async (req, res) => {
  const result = await getSemesterByIdService(req.params.id);
  return res.status(StatusCode.SUCCESS).json(result);
});

const getAllSemester = asyncHandler(async (req, res) => {
  const result = await getAllSemesterService(req.query);
  return res.status(StatusCode.SUCCESS).json(result);
});

const updateSemester = asyncHandler(async (req, res) => {
  const result = await updateSemesterService(req.params.id, req.body);
  return res.status(StatusCode.SUCCESS).json(result);
});

const deleteSemester = asyncHandler(async (req, res) => {
  const result = await deleteSemesterService(req.params.id);
  return res.status(StatusCode.SUCCESS).json(result);
});

const createSemesterSession = asyncHandler(async (req, res) => {
  const result = await registerSemesterService(req.body);
  return res.status(StatusCode.CREATED).json(result);
});

const getSemesterSessionById = asyncHandler(async (req, res) => {
  const result = await getSemesterByIdService(req.params.id);
  return res.status(StatusCode.SUCCESS).json(result);
});

const updateSemesterSession = asyncHandler(async (req, res) => {
  const result = await updateSemesterService(req.params.id, req.body);
  return res.status(StatusCode.SUCCESS).json(result);
});

const deleteSemesterSession = asyncHandler(async (req, res) => {
  const result = await deleteSemesterSessionService(req.params.id);
  return res.status(StatusCode.SUCCESS).json(result);
});

export {
  createSemester,
  getAllSemester,
  getSemesterById,
  updateSemester,
  deleteSemester,
  createSemesterSession,
  getSemesterSessionById,
  updateSemesterSession,
  deleteSemesterSession,
};
