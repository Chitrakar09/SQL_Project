import { apiError } from "../utils/apiError.js";
import { StatusCode } from "../constants.js";
import { validateRequiredFields } from "../utils/validateRequiredFields.js";
import { isValidEmail } from "../utils/emailValidator.js";
import validator from "validator"; // for validating UUID
import {
  registerStudentQuery,
  getStudentByIdQuery,
  getAllStudentsQuery,
  updateStudentQuery,
  deactivateStudentQuery,
} from "../Queries/student.queries.js";
import { apiResponse } from "../utils/apiResponse.js";
validateRequiredFields;

// register student service
const registerStudentService = async ({
  first_name,
  last_name,
  email,
  phone,
  gender,
  dob,
}) => {
  // validate the fields
  validateRequiredFields({ first_name, last_name, email, phone, gender, dob });

  if (!isValidEmail(email))
    throw new apiError(StatusCode.BAD_REQUEST, "Invalid email format");

  const normalizedStudentData = {
    first_name: first_name.trim(),
    last_name: last_name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    gender: gender.trim().toLowerCase(),
    dob: new Date(dob).toISOString().split("T")[0],
    admission_year: new Date().getFullYear(),
    current_status: "active",
  };

  const registeredStudent = await registerStudentQuery(normalizedStudentData);

  if (!registeredStudent)
    throw new apiError(
      StatusCode.INTERNAL_SERVER_ERROR,
      "Student could not be registered",
    );

  return new apiResponse(
    StatusCode.CREATED,
    registeredStudent,
    "Student successfully registered",
  );
};

// get student by id service
const getStudentByIdService = async (id) => {
  if (!validator.isUUID(id))
    throw new apiError(StatusCode.BAD_REQUEST, "Invalid UUID");
  const student = await getStudentByIdQuery(id);
  if (!student) throw new apiError(StatusCode.NOT_FOUND, "Student not found");

  return new apiResponse(StatusCode.SUCCESS, student, "Student retrieved");
};

// get all students service
const getAllStudentsService = async ({ limit, page, sortOrder, sortBy }) => {
  const pageNumber = parseInt(page, 10) || 1;
  const limitNumber = parseInt(limit, 10) || 10;
  if (pageNumber < 1 || isNaN(pageNumber))
    throw new apiError(400, "Invalid Page number");

  if (limitNumber < 1 || isNaN(limitNumber))
    throw new apiError(400, "Invalid limit");

  const skip = (pageNumber - 1) * limitNumber;

  const allowedSortFields = [
    "first_name",
    "last_name",
    "email",
    "d_o_b",
    "enrollment_year",
  ];

  if (sortBy && !allowedSortFields.includes(sortBy)) {
    throw new apiError(StatusCode.BAD_REQUEST, "Invalid sort field");
  }

  const sortByColumn = sortBy || "first_name";
  const sortOrderFinal =
    sortOrder && sortOrder.toLowerCase === "desc" ? "DESC" : "ASC";

  const students = await getAllStudentsQuery({
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
          totalStudents: 0,
          totalPages: 0,
          currentPage: pageNumber,
          limit: limitNumber,
          hasNextPage: false,
          hasPrevPage: false,
        },
      },
      "No students found",
    );
  }
  const totalPages = Math.ceil(students[0].total_count / limitNumber);

  return new apiResponse(
    StatusCode.SUCCESS,
    {
      students,
      pagination: {
        totalStudents:students[0].total_count,
        totalPages,
        currentPage: pageNumber,
        limit: limitNumber,
        hasNextPage: pageNumber < totalPages,
        hasPrevPage: pageNumber > 1,
      },
    },
    "Students retrieved successfully",
  );
};

// update student service
const updateStudentService = async (id, updates = {}) => {
  const { first_name, last_name, email, phone, gender, dob, status } = updates;
  if (!validator.isUUID(id))
    throw new apiError(StatusCode.BAD_REQUEST, "Invalid UUID");
  if (email && !isValidEmail(email))
    throw new apiError(StatusCode.BAD_REQUEST, "Invalid email format");

  const allowedStatusFields = [
    "active",
    "inactive",
    "graduated"
  ];

  if (status && !allowedStatusFields.includes(status)) {
    throw new apiError(StatusCode.BAD_REQUEST, "Invalid status");
  }

  const normalized = {
    ...(first_name && { first_name: first_name.trim() }),
    ...(last_name && { last_name: last_name.trim() }),
    ...(email && { email: email.trim().toLowerCase() }),
    ...(phone && { phone: phone.trim() }),
    ...(gender && { gender: gender.trim().toLowerCase() }),
    ...(dob && { dob: new Date(dob).toISOString().split("T")[0] }),
    ...(status && { current_status: status.trim().toLowerCase() }),
  };

  const updatedStudent = await updateStudentQuery(id, normalized);

  if (!updatedStudent)
    throw new apiError(StatusCode.NOT_FOUND, "Student not found");

  return new apiResponse(
    StatusCode.SUCCESS,
    updatedStudent,
    "Student information updated",
  );
};

// soft delete (deactivate) student service
const deactivateStudentService = async (id) => {
  if (!validator.isUUID(id))
    throw new apiError(StatusCode.BAD_REQUEST, "Invalid UUID");
  const deactivated = await deactivateStudentQuery(id);
  if (!deactivated)
    throw new apiError(
      StatusCode.NOT_FOUND,
      "Student not found or already inactive",
    );

  return new apiResponse(
    StatusCode.SUCCESS,
    deactivated,
    "Student deactivated successfully",
  );
};

export {
  registerStudentService,
  getStudentByIdService,
  getAllStudentsService,
  updateStudentService,
  deactivateStudentService,
};
