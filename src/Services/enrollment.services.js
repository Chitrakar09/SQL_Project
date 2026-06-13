import { apiError } from "../utils/apiError";
import { apiResponse } from "../utils/apiResponse";
import { StatusCode } from "../constants";
import { validateRequiredFields } from "../utils/validateRequiredFields";
import validator from "validator";
import {
  registerEnrollmentQuery,
  getEnrollmentByIdQuery,
  updateEnrollmentQuery,
  deleteEnrollmentQuery,
  getAllStudentOfDepartmentQuery,
  getStudentByCoursesQuery,
  getStudentsWithoutEnrollmentQuery,
} from "../Queries/enrollment.queries";
import { getStudentCountPerDepartmentQuery } from "../Queries/analytics.queries";

// register enrollment
const registerEnrollmentService = async ({
  student_id,
  course_id,
  semester_session_id,
}) => {
  // validate the fields
  validateRequiredFields({ student_id, course_id, semester_session_id });

  const uuidFields = {
    student_id,
    course_id,
    semester_session_id,
  };
  // ([_, value]) means ([key, value]) but we don't need key yet. The _ is a convention meaning: "I received this value, but I'm intentionally ignoring it."
  const invalidFields = Object.entries(uuidFields)
    .filter(([_, value]) => !validator.isUUID(value))
    .map(([key]) => key);

  if (invalidFields.length) {
    throw new apiError(
      StatusCode.BAD_REQUEST,
      `Invalid UUID(s): ${invalidFields.join(", ")}`,
    );
  }

  const normalizedEnrollmentData = {
    student_id,
    course_id,
    semester_session_id,
    current_status: "active",
    enrollment_year: new Date().toISOString().split("T")[0],
  };

  const registeredEnrollment = await registerEnrollmentQuery(
    normalizedEnrollmentData,
  );

  if (!registeredEnrollment)
    throw new apiError(
      StatusCode.INTERNAL_SERVER_ERROR,
      "Enrollment could not be registered",
    );

  return new apiResponse(
    StatusCode.CREATED,
    registeredStudent,
    "Enrollment successfully registered",
  );
};

// get enrollment by Id
const getEnrollmentByIdService = async (id) => {
  if (!validator.isUUID(id))
    throw new apiError(StatusCode.BAD_REQUEST, "Invalid UUID");
  const enrollment = await getEnrollmentByIdQuery(id);
  if (!enrollment)
    throw new apiError(StatusCode.NOT_FOUND, "enrollment not found");

  return new apiResponse(
    StatusCode.SUCCESS,
    enrollment,
    "enrollment retrieved",
  );
};

// update student service
const updateEnrollmentService = async (id, updates = {}) => {
  const { semester_session_id, updated_current_status } = updates;

  const uuidFields = {
    id,
    semester_session_id,
  };
  // ([_, value]) means ([key, value]) but we don't need key yet. The _ is a convention meaning: "I received this value, but I'm intentionally ignoring it."
  const invalidFields = Object.entries(uuidFields)
    .filter(([_, value]) => !validator.isUUID(value))
    .map(([key]) => key);

  if (invalidFields.length) {
    throw new apiError(
      StatusCode.BAD_REQUEST,
      `Invalid UUID(s): ${invalidFields.join(", ")}`,
    );
  }

  const allowedStatusFields = [
    "active",
    "completed",
    "dropped",
    "failed",
    "withdrawn",
  ];

  if (
    updated_current_status &&
    !allowedStatusFields.includes(updated_current_status)
  ) {
    throw new apiError(StatusCode.BAD_REQUEST, "Invalid status");
  }

  const normalized = {
    ...(semester_session_id && { semester_session_id }),
    ...(updated_current_status && { current_status: updated_current_status }),
  };

  const updatedEnrollment = await updateEnrollmentQuery(id, normalized);

  if (!updatedEnrollment)
    throw new apiError(StatusCode.NOT_FOUND, "enrollment not found");

  return new apiResponse(
    StatusCode.SUCCESS,
    updatedEnrollment,
    "enrollment information updated",
  );
};

// delete enrollment service
const deleteEnrollmentService = async (id) => {
  if (!validator.isUUID(id))
    throw new apiError(StatusCode.BAD_REQUEST, "Invalid UUID");
  const deleted = await deleteEnrollmentQuery(id);
  if (!deleted)
    throw new apiError(StatusCode.NOT_FOUND, "Enrollment not found");

  return new apiResponse(
    StatusCode.SUCCESS,
    deleted,
    "Enrollment deleted successfully",
  );
};

const getStudentsOfDepartmentService = async (
  { id },
  { limit, page, sortOrder, sortBy },
) => {
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
    "s.first_name",
    "s.last_name",
    "s.email",
    "d.department_name",
  ];

  if (sortBy && !allowedSortFields.includes(sortBy)) {
    throw new apiError(StatusCode.BAD_REQUEST, "Invalid sort field");
  }

  const sortByColumn = sortBy || "d.department_name";
  const sortOrderFinal =
    sortOrder && sortOrder.toLowerCase === "desc" ? "DESC" : "ASC";

  const students = await getAllStudentOfDepartmentQuery(id, {
    limitNumber,
    skip,
    sortByColumn,
    sortOrderFinal,
  });

  if (!students) {
    return new apiResponse(
      StatusCode.SUCCESS,
      {
        students,
        pagination: {
          totalPages: 0,
          currentPage: pageNumber,
          limit: limitNumber,
          hasNextPage: false,
          hasPrevPage: false,
        },
      },
      "No students found in the department",
    );
  }
  const totalPages = Math.ceil(students[0].total_count / limitNumber);

  return new apiResponse(
    StatusCode.SUCCESS,
    {
      students,
      pagination: {
        totalPages,
        currentPage: pageNumber,
        limit: limitNumber,
        hasNextPage: pageNumber < totalPages,
        hasPrevPage: pageNumber > 1,
      },
    },
    "Students of the department retrieved successfully",
  );
};

const countStudentsPerDepartmentService = async () => {
  const data = await getStudentCountPerDepartmentQuery();
  return new apiResponse(
    StatusCode.SUCCESS,
    data,
    "Students per department count retrieved successfully",
  );
};

const getStudentsByCoursesService = async ({
  limit,
  page,
  sortOrder,
  sortBy,
}) => {
  const pageNumber = parseInt(page, 10) || 1;
  const limitNumber = parseInt(limit, 10) || 10;
  if (pageNumber < 1 || isNaN(pageNumber))
    throw new apiError(400, "Invalid Page number");

  if (limitNumber < 1 || isNaN(limitNumber))
    throw new apiError(400, "Invalid limit");

  const skip = (pageNumber - 1) * limitNumber;

  const allowedSortFields = [
    "c.course_code",
    "c.course_name",
    "s.first_name",
    "s.last_name",
    "e.enrollment_year",
  ];

  if (sortBy && !allowedSortFields.includes(sortBy)) {
    throw new apiError(StatusCode.BAD_REQUEST, "Invalid sort field");
  }

  const sortByColumn = sortBy || "c.course_name";
  const sortOrderFinal =
    sortOrder && sortOrder.toLowerCase === "desc" ? "DESC" : "ASC";

  const students = await getStudentByCoursesQuery({
    limitNumber,
    skip,
    sortByColumn,
    sortOrderFinal,
  });

  if (!students) {
    return new apiResponse(
      StatusCode.SUCCESS,
      {
        students,
        pagination: {
          totalPages: 0,
          currentPage: pageNumber,
          limit: limitNumber,
          hasNextPage: false,
          hasPrevPage: false,
        },
      },
      "No students enrolled in the courses",
    );
  }
  const totalPages = Math.ceil(students[0].total_count / limitNumber);

  return new apiResponse(
    StatusCode.SUCCESS,
    {
      students,
      pagination: {
        totalPages,
        currentPage: pageNumber,
        limit: limitNumber,
        hasNextPage: pageNumber < totalPages,
        hasPrevPage: pageNumber > 1,
      },
    },
    "Students enrolled in the courses retrieved successfully",
  );
};

const getStudentsOfCourseService = async ({id},{
  limit,
  page,
  sortOrder,
  sortBy,
}) => {

  if(!(validator.isUUID(id))) throw new apiError(StatusCode.BAD_REQUEST,"Invalid course id")

  const pageNumber = parseInt(page, 10) || 1;
  const limitNumber = parseInt(limit, 10) || 10;
  if (pageNumber < 1 || isNaN(pageNumber))
    throw new apiError(400, "Invalid Page number");

  if (limitNumber < 1 || isNaN(limitNumber))
    throw new apiError(400, "Invalid limit");

  const skip = (pageNumber - 1) * limitNumber;

  const allowedSortFields = [
    "c.course_code",
    "c.course_name",
    "s.first_name",
    "s.last_name",
    "e.enrollment_year",
  ];

  if (sortBy && !allowedSortFields.includes(sortBy)) {
    throw new apiError(StatusCode.BAD_REQUEST, "Invalid sort field");
  }

  const sortByColumn = sortBy || "c.course_name";
  const sortOrderFinal =
    sortOrder && sortOrder.toLowerCase === "desc" ? "DESC" : "ASC";

  const students = await getStudentByCoursesQuery(id,{
    limitNumber,
    skip,
    sortByColumn,
    sortOrderFinal,
  });

  if (!students) {
    return new apiResponse(
      StatusCode.SUCCESS,
      {
        students,
        pagination: {
          totalPages: 0,
          currentPage: pageNumber,
          limit: limitNumber,
          hasNextPage: false,
          hasPrevPage: false,
        },
      },
      "No students enrolled in the course",
    );
  }
  const totalPages = Math.ceil(students[0].total_count / limitNumber);

  return new apiResponse(
    StatusCode.SUCCESS,
    {
      students,
      pagination: {
        totalPages,
        currentPage: pageNumber,
        limit: limitNumber,
        hasNextPage: pageNumber < totalPages,
        hasPrevPage: pageNumber > 1,
      },
    },
    "Students enrolled in the course retrieved successfully",
  );
};

const getStudentsWithoutEnrollmentService = async ({
  limit,
  page,
  sortOrder,
  sortBy,
}) => {
  const pageNumber = parseInt(page, 10) || 1;
  const limitNumber = parseInt(limit, 10) || 10;
  if (pageNumber < 1 || isNaN(pageNumber))
    throw new apiError(400, "Invalid Page number");

  if (limitNumber < 1 || isNaN(limitNumber))
    throw new apiError(400, "Invalid limit");

  const skip = (pageNumber - 1) * limitNumber;

  const allowedSortFields = [
    "s.first_name",
    "s.last_name",
    "s.email",
    "s.admission_year"
  ];

  if (sortBy && !allowedSortFields.includes(sortBy)) {
    throw new apiError(StatusCode.BAD_REQUEST, "Invalid sort field");
  }

  const sortByColumn = sortBy || "s.first_name";
  const sortOrderFinal =
    sortOrder && sortOrder.toLowerCase === "desc" ? "DESC" : "ASC";

  const students = await getStudentsWithoutEnrollmentQuery({
    limitNumber,
    skip,
    sortByColumn,
    sortOrderFinal,
  });

  if (!students) {
    return new apiResponse(
      StatusCode.SUCCESS,
      {
        students,
        pagination: {
          totalPages: 0,
          currentPage: pageNumber,
          limit: limitNumber,
          hasNextPage: false,
          hasPrevPage: false,
        },
      },
      "students without enrollment found",
    );
  }
  const totalPages = Math.ceil(students[0].total_count / limitNumber);

  return new apiResponse(
    StatusCode.SUCCESS,
    {
      students,
      pagination: {
        totalPages,
        currentPage: pageNumber,
        limit: limitNumber,
        hasNextPage: pageNumber < totalPages,
        hasPrevPage: pageNumber > 1,
      },
    },
    "Students without enrollment retrieved successfully",
  );
};

export {
  registerEnrollmentService,
  getEnrollmentByIdService,
  updateEnrollmentService,
  deleteEnrollmentService,
  getStudentsOfDepartmentService,
  countStudentsPerDepartmentService,
  getStudentsByCoursesService,
  getStudentsWithoutEnrollmentService,
  getStudentsOfCourseService
};
