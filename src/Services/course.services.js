import { apiError } from "../utils/apiError";
import { apiResponse } from "../utils/apiResponse";
import { StatusCode } from "../constants";
import { validateRequiredFields } from "../utils/validateRequiredFields";
import validator from "validator";
import {
  registerCourseQuery,
  getCourseByIdQuery,
  getAllCourseQuery,
  updateCourseQuery,
  deleteCourseQuery,
  getAllCoursesOfDepartmentQuery,
  getCoursesBySemesterQuery,
  getCourseFullDetailQuery,
  getCourseTaughtByInstructor,
  getCoursesWithNoInstructorQuery,
} from "../Queries/course.queries";
import { getMostPopularCourseQuery } from "../Queries/analytics.queries";

// register course
const registerCourseService = async ({
  courseCode,
  courseName,
  credits,
  department_id,
}) => {
  validateRequiredFields({ courseCode, courseName, credits });

  const normalizedCourseData = {
    course_code: courseCode.trim(),
    course_name: courseName.trim(),
    credits: parseInt(credits),
    ...(department_id && { department_id: department_id.trim() }),
  };

  const registeredCourse = await registerCourseQuery(normalizedCourseData);

  if (!registeredCourse)
    throw new apiError(
      StatusCode.INTERNAL_SERVER_ERROR,
      "Course could not be registered",
    );

  return new apiResponse(
    StatusCode.CREATED,
    registeredCourse,
    "Course successfully registered",
  );
};

// get course by Id
const getCourseByIdService = async (id) => {
  if (!validator.isUUID(id))
    throw new apiError(StatusCode.BAD_REQUEST, "Invalid UUID");
  const course = await getCourseByIdQuery(id);
  if (!course) throw new apiError(StatusCode.NOT_FOUND, "course not found");

  return new apiResponse(StatusCode.SUCCESS, course, "course retrieved");
};

// get all students service
const getAllCourseService = async ({ limit, page, sortOrder, sortBy }) => {
  const pageNumber = parseInt(page, 10) || 1;
  const limitNumber = parseInt(limit, 10) || 10;
  if (pageNumber < 1 || isNaN(pageNumber))
    throw new apiError(400, "Invalid Page number");

  if (limitNumber < 1 || isNaN(limitNumber))
    throw new apiError(400, "Invalid limit");

  const skip = (pageNumber - 1) * limitNumber;

  const allowedSortFields = ["course_name", "course_code", "credits"];

  if (sortBy && !allowedSortFields.includes(sortBy)) {
    throw new apiError(StatusCode.BAD_REQUEST, "Invalid sort field");
  }

  const sortByColumn = sortBy || "course_name";
  const sortOrderFinal =
    sortOrder && sortOrder.toLowerCase() === "desc" ? "DESC" : "ASC";

  const courses = await getAllCourseQuery({
    limitNumber,
    skip,
    sortByColumn,
    sortOrderFinal,
  });

  if (!courses) {
    return new apiResponse(
      StatusCode.SUCCESS,
      {
        courses,
        pagination: {
          totalCourses: 0,
          totalPages: 0,
          currentPage: pageNumber,
          limit: limitNumber,
          hasNextPage: false,
          hasPrevPage: false,
        },
      },
      "No course found",
    );
  }
  const totalPages = Math.ceil(courses[0].total_count / limitNumber);

  return new apiResponse(
    StatusCode.SUCCESS,
    {
      courses,
      pagination: {
        totalCourses: courses[0].total_count,
        totalPages,
        currentPage: pageNumber,
        limit: limitNumber,
        hasNextPage: pageNumber < totalPages,
        hasPrevPage: pageNumber > 1,
      },
    },
    "courses retrieved successfully",
  );
};

const getAllCourseOfDepartmentService = async ({ id },{ limit, page, sortOrder, sortBy }) => {
  if (!validator.isUUID(id))
    throw new apiError(StatusCode.BAD_REQUEST, "Invalid UUID");

 const pageNumber = parseInt(page, 10) || 1;
  const limitNumber = parseInt(limit, 10) || 10;
  if (pageNumber < 1 || isNaN(pageNumber))
    throw new apiError(400, "Invalid Page number");

  if (limitNumber < 1 || isNaN(limitNumber))
    throw new apiError(400, "Invalid limit");

  const skip = (pageNumber - 1) * limitNumber;

  const allowedSortFields = [
    "course_code",
    "course_name",
  ];

  if (sortBy && !allowedSortFields.includes(sortBy)) {
    throw new apiError(StatusCode.BAD_REQUEST, "Invalid sort field");
  }

  const sortByColumn = sortBy || "course_code";
  const sortOrderFinal =
    sortOrder && sortOrder.toLowerCase === "desc" ? "DESC" : "ASC";

  const courses = await getAllCoursesOfDepartmentQuery(id, {
    limitNumber,
    skip,
    sortByColumn,
    sortOrderFinal,
  });

 if (!courses) {
    return new apiResponse(
      StatusCode.SUCCESS,
      {
        courses,
        pagination: {
          totalPages: 0,
          currentPage: pageNumber,
          limit: limitNumber,
          hasNextPage: false,
          hasPrevPage: false,
        },
      },
      "No courses found",
    );
  }
  const totalPages = Math.ceil(courses[0].total_count / limitNumber);

  return new apiResponse(
    StatusCode.SUCCESS,
    {
      courses,
      pagination: {
        totalPages,
        currentPage: pageNumber,
        limit: limitNumber,
        hasNextPage: pageNumber < totalPages,
        hasPrevPage: pageNumber > 1,
      },
    },
    "courses retrieved successfully",
  );
};

const getCoursesBySemesterService = async () => {
  const courses = await getCoursesBySemesterQuery();

  return new apiResponse(
    StatusCode.SUCCESS,
    courses,
    courses.length
      ? "Courses by semester retrieved successfully"
      : "No courses found for semester",
  );
};

const getCourseFullDetailsService = async ({ id }) => {
  if (!validator.isUUID(id))
    throw new apiError(StatusCode.BAD_REQUEST, "Invalid UUID");

  const courseDetails = await getCourseFullDetailQuery(id);
  if (!courseDetails)
    throw new apiError(StatusCode.NOT_FOUND, "Course not found");

  return new apiResponse(
    StatusCode.SUCCESS,
    courseDetails,
    "Course full details retrieved successfully",
  );
};

const getCoursesTaughtByInstructorService = async ({ id }) => {
  if (!validator.isUUID(id))
    throw new apiError(StatusCode.BAD_REQUEST, "Invalid UUID");

  const courses = await getCourseTaughtByInstructor(id);
  return new apiResponse(
    StatusCode.SUCCESS,
    courses,
    "Courses taught by instructor retrieved successfully",
  );
};

const getMostPopularCourseService = async () => {
  const result = await getMostPopularCourseQuery();

  return new apiResponse(
    StatusCode.SUCCESS,
    result,
    result.length
      ? "Most popular course retrieved successfully"
      : "No popular course data available",
  );
};

const getCoursesWithNoInstructorService = async () => {
  const result = await getCoursesWithNoInstructorQuery();

  return new apiResponse(
    StatusCode.SUCCESS,
    result,
    result.length
      ? "Courses with no instructor retrieved successfully"
      : "No courses without instructor found",
  );
};

const updateCourseService = async (id, updates = {}) => {
  const { course_name, course_code, credits, department_id } = updates;
  if (!validator.isUUID(id))
    throw new apiError(StatusCode.BAD_REQUEST, "Invalid UUID");

  const normalized = {
    ...(course_code && { course_code: course_code.trim() }),
    ...(course_name && { course_name: course_name.trim() }),
    ...(credits && { credits: parseInt(credits) }),
    ...(department_id && { department_id: department_id.trim() }),
  };

  const updatedCourse = await updateCourseQuery(id, normalized);

  if (!updatedCourse)
    throw new apiError(StatusCode.NOT_FOUND, "course not found");

  return new apiResponse(
    StatusCode.SUCCESS,
    updatedCourse,
    "course information updated",
  );
};

// delete course service
const deleteCourseService = async (id) => {
  if (!validator.isUUID(id))
    throw new apiError(StatusCode.BAD_REQUEST, "Invalid UUID");
  const deleted = await deleteCourseQuery(id);
  if (!deleted) throw new apiError(StatusCode.NOT_FOUND, "Course not found");

  return new apiResponse(
    StatusCode.SUCCESS,
    deleted,
    "Course deleted successfully",
  );
};

export {
  registerCourseService,
  getAllCourseService,
  getCourseByIdService,
  updateCourseService,
  deleteCourseService,
  getAllCourseOfDepartmentService,
  getCoursesBySemesterService,
  getCourseFullDetailsService,
  getCoursesTaughtByInstructorService,
  getMostPopularCourseService,
  getCoursesWithNoInstructorService,
};
