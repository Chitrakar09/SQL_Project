import { apiError } from "../utils/apiError.js";
import { StatusCode } from "../constants.js";
import { validateRequiredFields } from "../utils/validateRequiredFields.js";
import { isValidEmail } from "../utils/emailValidator.js";
import validator from "validator"; // for validating UUID
import {
  registerInstructorQuery,
  getInstructorByIdQuery,
  getAllInstructorsQuery,
  updateInstructorQuery,
  deactivateInstructorQuery,
} from "../Queries/instructor.queries.js";
import { apiResponse } from "../utils/apiResponse.js";
import { unAssignInstructorCourseQuery } from "../Queries/instructor.queries.js";
validateRequiredFields;

// register instructor service
const registerInstructorService = async ({
  fullName,
  email,
  hireDate,
  departmentId,
  currentStatus,
}) => {
  // validate the fields
  validateRequiredFields({ fullName, email, hireDate });

  if (!isValidEmail(email))
    throw new apiError(StatusCode.BAD_REQUEST, "Invalid email format");

  if (departmentId && !validator.isUUID(departmentId))
    throw new apiError(StatusCode.BAD_REQUEST, "Invalid UUID");

  const normalizedInstructorData = {
    full_name: fullName.trim(),
    email: email.trim().toLowerCase(),
    hire_date: parseInt(hireDate),
    ...(departmentId && { department_id: departmentId }),
    current_status: "active",
  };

  const registeredInstructor = await registerInstructorQuery(
    normalizedInstructorData,
  );

  if (!registeredInstructor)
    throw new apiError(
      StatusCode.INTERNAL_SERVER_ERROR,
      "Instructor could not be registered",
    );

  return new apiResponse(
    StatusCode.CREATED,
    registeredInstructor,
    "Instructor successfully registered",
  );
};

// get instructor by id service
const getInstructorByIdService = async (id) => {
  if (!validator.isUUID(id))
    throw new apiError(StatusCode.BAD_REQUEST, "Invalid UUID");
  const instructor = await getInstructorByIdQuery(id);
  if (!instructor)
    throw new apiError(StatusCode.NOT_FOUND, "Instructor not found");

  return new apiResponse(
    StatusCode.SUCCESS,
    instructor,
    "Instructor retrieved",
  );
};

// get all instructors service
const getAllInstructorsService = async ({ limit, page, sortOrder, sortBy }) => {
  const pageNumber = parseInt(page, 10) || 1;
  const limitNumber = parseInt(limit, 10) || 10;
  if (pageNumber < 1 || isNaN(pageNumber))
    throw new apiError(400, "Invalid Page number");

  if (limitNumber < 1 || isNaN(limitNumber))
    throw new apiError(400, "Invalid limit");

  const skip = (pageNumber - 1) * limitNumber;

  const allowedSortFields = ["full_name", "hire_date"];

  if (sortBy && !allowedSortFields.includes(sortBy)) {
    throw new apiError(StatusCode.BAD_REQUEST, "Invalid sort field");
  }

  const sortByColumn = sortBy || "full_name";
  const sortOrderFinal =
    sortOrder && sortOrder.toLowerCase === "desc" ? "DESC" : "ASC";

  const instructors = await getAllInstructorsQuery({
    limitNumber,
    skip,
    sortByColumn,
    sortOrderFinal,
  });

  if (!instructors) {
    return new apiResponse(
      StatusCode.SUCCESS,
      {
        instructors,
        pagination: {
          totalInstructors: 0,
          totalPages: 0,
          currentPage: pageNumber,
          limit: limitNumber,
          hasNextPage: false,
          hasPrevPage: false,
        },
      },
      "No instructors found",
    );
  }
  const totalPages = Math.ceil(instructors[0].total_count / limitNumber);

  return new apiResponse(
    StatusCode.SUCCESS,
    {
      instructors,
      pagination: {
        totalInstructors: instructors[0].total_count,
        totalPages,
        currentPage: pageNumber,
        limit: limitNumber,
        hasNextPage: pageNumber < totalPages,
        hasPrevPage: pageNumber > 1,
      },
    },
    "Instructors retrieved successfully",
  );
};

// update instructor service
const updateInstructorService = async (id, updates = {}) => {
  const { fullName, email, departmentId, updatedStatus } = updates;
  if (!validator.isUUID(id))
    throw new apiError(StatusCode.BAD_REQUEST, "Invalid UUID");
  if (email && !isValidEmail(email))
    throw new apiError(StatusCode.BAD_REQUEST, "Invalid email format");

  const allowedStatusFields = [
    "active",
    "on_leave",
    "inactive",
    "resigned",
    "retired",
  ];

  if (updatedStatus && !allowedStatusFields.includes(updatedStatus)) {
    throw new apiError(StatusCode.BAD_REQUEST, "Invalid status");
  }

  if (departmentId && !validator.isUUID(departmentId))
    throw new apiError(StatusCode.BAD_REQUEST, "Invalid UUID");

  const normalized = {
    ...(fullName && { full_name: fullName.trim() }),
    ...(email && { email: email.trim().toLowerCase() }),
    ...(departmentId && { department_id: departmentId }),
    ...(updatedStatus && { current_status: updatedStatus }),
  };

  const updatedInstructor = await updateInstructorQuery(id, normalized);

  if (!updatedInstructor)
    throw new apiError(StatusCode.NOT_FOUND, "Instructor not found");

  return new apiResponse(
    StatusCode.SUCCESS,
    updatedInstructor,
    "Instructor information updated",
  );
};

// soft delete (deactivate) instructor service
const deactivateInstructorService = async (id) => {
  if (!validator.isUUID(id))
    throw new apiError(StatusCode.BAD_REQUEST, "Invalid UUID");
  const deactivated = await deactivateInstructorQuery(id);
  if (!deactivated)
    throw new apiError(
      StatusCode.NOT_FOUND,
      "Instructor not found or already inactive",
    );

  return new apiResponse(
    StatusCode.SUCCESS,
    deactivated,
    "Instructor deactivated successfully",
  );
};

const assignInstructorCourseService = async ({ instructor_email, course_code }) => {
  // validate the fields
  validateRequiredFields({ instructor_email, course_code });

 if(!(isValidEmail(instructor_email))) throw new apiError(StatusCode.BAD_REQUEST,"Invalid email type")
  const normalizedData = {
    instructor_email,
    course_code,
  };
  const assignInstructorCourse =
    await assignInstructorCourseQuery(normalizedData);

  if (!assignInstructorCourse)
    throw new apiError(
      StatusCode.INTERNAL_SERVER_ERROR,
      "Course could not be assigned to the instructor",
    );

  return new apiResponse(
    StatusCode.CREATED,
    assignInstructorCourse,
    "Successfully assigned course to the instructor",
  );
};

const getInstructorCourseByIdService = async (id) => {
  if (!validator.isUUID(id))
    throw new apiError(StatusCode.BAD_REQUEST, "Invalid UUID");
  const instructorCourses = await getInstructorCourseByIdQuery(id);
  if (!instructorCourses)
    throw new apiError(
      StatusCode.NOT_FOUND,
      "Courses assigned to instructor not found",
    );

  return new apiResponse(
    StatusCode.SUCCESS,
    instructor,
    "Courses assigned to instructor retrieved",
  );
};

const updateInstructorCourseService = async (id, updates = {}) => {
  const { toBeUpdatedCourseId, updatedCourseId } = updates;

  validateRequiredFields({ toBeUpdatedCourseId, updatedCourseId });

  if (
    !(
      validator.isUUID(id) &&
      validator(updatedCourseId) &&
      validator(toBeUpdatedCourseId)
    )
  )
    throw new apiError(StatusCode.BAD_REQUEST, "Invalid UUID");

  const normalized = {
    toBeUpdatedCourseId,
    updatedCourseId,
  };

  try {
    const updatedInstructor = await updateInstructorCourseQuery(id, normalized);
    const updatedInstructor = await updateInstructorCourseQuery(id, normalized);
  } catch (error) {
    if (error.code === "23505") {
      throw new apiError(
        StatusCode.CONFLICT,
        "Course is already assigned to the instructor",
      );
    }
  }

  if (!updatedInstructorCourse)
    throw new apiError(
      StatusCode.NOT_FOUND,
      "Either Instructor or course not found",
    );

  return new apiResponse(
    StatusCode.SUCCESS,
    updatedInstructor,
    "Instructor course updated",
  );
};

const unAssignInstructorCourseService= async({instructorId,courseId})=>{
    validateRequiredFields({ instructorId, courseId });

  if (!(validator.isUUID(instructorId) && validator.isUUID(courseId)))
    throw new apiError(StatusCode.BAD_REQUEST, "Invalid UUID");

  const normalizedData = {
    instructor_id: instructorId,
    course_id: courseId,
  };

  const unAssigned = await unAssignInstructorCourseQuery(normalizedData);
  if (!unAssigned) throw new apiError(StatusCode.NOT_FOUND, "Instructor with the specified Course not found");

  return new apiResponse(
    StatusCode.SUCCESS,
    unAssigned,
    "unAssigned course successfully",
  );
}

export {
  registerInstructorService,
  getInstructorByIdService,
  getAllInstructorsService,
  updateInstructorService,
  deactivateInstructorService,
};
