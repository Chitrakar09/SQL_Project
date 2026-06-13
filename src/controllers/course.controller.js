import { asyncHandler } from "../utils/asyncHandler";
import { StatusCode } from "../constants";

const registerCourse = asyncHandler(async (req, res) => {
  const result = await registerCourseService(req.body);
  return res.status(StatusCode.CREATED).json(result);
});

const getCourseById = asyncHandler(async (req, res) => {
  const result = await getCourseByIdService(req.params.id);
  return res.status(StatusCode.SUCCESS).json(result);
});

const getAllCourse = asyncHandler(async (req, res) => {
  const result = await getAllCourseService(req.query);
  return res.status(StatusCode.SUCCESS).json(result);
});

const updateCourse = asyncHandler(async (req, res) => {
  const result = await updateCourseService(req.params.id, req.body);
  return res.status(StatusCode.SUCCESS).json(result);
});

const deleteCourse = asyncHandler(async (req, res) => {
  const result = await deleteCourseService(req.params.id);
  return res.status(StatusCode.SUCCESS).json(result);
});

const getAllCourseOfDepartment = asyncHandler(async (req, res) => {
  const result = await getAllCourseOfDepartmentService(req.params,req.query);
  return res.status(StatusCode.SUCCESS).json(result);
});

const getCoursesBySemester = asyncHandler(async (req, res) => {
  const result = await getCoursesBySemesterService();
  return res.status(StatusCode.SUCCESS).json(result);
});

const getCourseFullDetails = asyncHandler(async (req, res) => {
  const result = await getCourseFullDetailsService(req.params);
  return res.status(StatusCode.SUCCESS).json(result);
});

const getCoursesTaughtByInstructor = asyncHandler(async (req, res) => {
  const result = await getCoursesTaughtByInstructorService(req.params);
  return res.status(StatusCode.SUCCESS).json(result);
});

const getMostPopularCourse = asyncHandler(async (req, res) => {
  const result = await getMostPopularCourseService();
  return res.status(StatusCode.SUCCESS).json(result);
});

const getCoursesWithNoInstructor = asyncHandler(async (req, res) => {
  const result = await getCoursesWithNoInstructorService();
  return res.status(StatusCode.SUCCESS).json(result);
});

export {
  registerCourse,
  getAllCourse,
  getCourseById,
  updateCourse,
  deleteCourse,
  getAllCourseOfDepartment,
  getCoursesBySemester,
  getCourseFullDetails,
  getCoursesTaughtByInstructor,
  getMostPopularCourse,
  getCoursesWithNoInstructor,
};
