import { apiError } from "../utils/apiError";
import { StatusCode } from "../constants";
import { validateRequiredFields } from "../utils/validateRequiredFields";
import validator from "validator";

// register course
const registerCourseService = async ({
  courseCode,
  courseName,
  credits,
  department_id,
}) => {
  // validate the fields
  validateRequiredFields({ course_code, course_name, credits });

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
    registeredStudent,
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
    sortOrder && sortOrder.toLowerCase === "desc" ? "DESC" : "ASC";

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

// update student service
const updateCourseService = async (id, updates = {}) => {
  const { course_name, course_code, credits, department_id } = updates;
  if (!validator.isUUID(id))
    throw new apiError(StatusCode.BAD_REQUEST, "Invalid UUID");

  const normalized = {
    ...(course_code && { course_code: course_code.trim() }),
    ...(course_name && { course_name: courseName.trim() }),
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

export { registerCourseService, getAllCourseService, getCourseByIdService, updateCourseService, deleteCourseService };
