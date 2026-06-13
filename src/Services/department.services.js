import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { StatusCode } from "../constants.js";
import { validateRequiredFields } from "../utils/validateRequiredFields.js";
import validator from "validator";
import {
  registerDepartmentQuery,
  getDepartmentByIdQuery,
  getAllDepartmentQuery,
  updateDepartmentQuery,
  deleteDepartmentQuery,
} from "../Queries/department.queries.js";
import {
  getDepartmentStudentCountQuery,
  countCoursesPerDepartmentQuery,
} from "../Queries/analytics.queries.js";

// register department
const registerDepartmentService = async ({
  department_name,
  building,
  office_number,
}) => {
  validateRequiredFields({ department_name });

  const normalizedDepartmentData = {
    department_name: department_name.trim(),
    ...(building && { building: building.trim() }),
    ...(office_number && { office_number: office_number.trim() }),
  };

  const registeredDepartment = await registerDepartmentQuery(
    normalizedDepartmentData,
  );

  if (!registeredDepartment)
    throw new apiError(
      StatusCode.INTERNAL_SERVER_ERROR,
      "Department could not be registered",
    );

  return new apiResponse(
    StatusCode.CREATED,
    registeredDepartment,
    "Department successfully registered",
  );
};

const getDepartmentStudentCountService = async () => {
  const data = await getDepartmentStudentCountQuery();
  return new apiResponse(
    StatusCode.SUCCESS,
    data,
    "Department student count retrieved successfully",
  );
};

const countCoursesPerDepartmentService = async () => {
  const data = await countCoursesPerDepartmentQuery();
  return new apiResponse(
    StatusCode.SUCCESS,
    data,
    "Course count per department retrieved successfully",
  );
};

// get department by Id
const getDepartmentByIdService = async (id) => {
  if (!validator.isUUID(id))
    throw new apiError(StatusCode.BAD_REQUEST, "Invalid UUID");
  const department = await getDepartmentByIdQuery(id);
  if (!department) throw new apiError(StatusCode.NOT_FOUND, "department not found");

  return new apiResponse(StatusCode.SUCCESS, department, "department retrieved");
};

// get all students service
const getAllDepartmentService = async ({ limit, page, sortOrder, sortBy }) => {
  const pageNumber = parseInt(page, 10) || 1;
  const limitNumber = parseInt(limit, 10) || 10;
  if (pageNumber < 1 || isNaN(pageNumber))
    throw new apiError(400, "Invalid Page number");

  if (limitNumber < 1 || isNaN(limitNumber))
    throw new apiError(400, "Invalid limit");

  const skip = (pageNumber - 1) * limitNumber;

  const allowedSortFields = [
    "department_name",
    "building",
    "office_number",
  ];

  if (sortBy && !allowedSortFields.includes(sortBy)) {
    throw new apiError(StatusCode.BAD_REQUEST, "Invalid sort field");
  }

  const sortByColumn = sortBy || "department_name";
  const sortOrderFinal =
    sortOrder && sortOrder.toLowerCase() === "desc" ? "DESC" : "ASC";

  const departments = await getAllDepartmentQuery({
    limitNumber,
    skip,
    sortByColumn,
    sortOrderFinal,
  });

  if (!departments) {
    return new apiResponse(
      StatusCode.SUCCESS,
      {
        departments,
        pagination: {
          totalDepartments: 0,
          totalPages: 0,
          currentPage: pageNumber,
          limit: limitNumber,
          hasNextPage: false,
          hasPrevPage: false,
        },
      },
      "No department found",
    );
  }
  const totalPages = Math.ceil(departments[0].total_count / limitNumber);

  return new apiResponse(
    StatusCode.SUCCESS,
    {
      departments,
      pagination: {
        totalDepartments: departments[0].total_count,
        totalPages,
        currentPage: pageNumber,
        limit: limitNumber,
        hasNextPage: pageNumber < totalPages,
        hasPrevPage: pageNumber > 1,
      },
    },
    "departments retrieved successfully",
  );
};

// update student service
const updateDepartmentService = async (id, updates = {}) => {
  const { department_name, building, office_number } = updates;
  if (!validator.isUUID(id))
    throw new apiError(StatusCode.BAD_REQUEST, "Invalid UUID");

  const normalized = {
    ...(department_name && { department_name: department_name.trim() }),
    ...(building && { building: building.trim() }),
    ...(office_number && { office_number: office_number.trim() }),
  };

  const updatedDepartment = await updateDepartmentQuery(id, normalized);

  if (!updatedDepartment)
    throw new apiError(StatusCode.NOT_FOUND, "department not found");

  return new apiResponse(
    StatusCode.SUCCESS,
    updatedDepartment,
    "department information updated",
  );
};

// delete department service
const deleteDepartmentService = async (id) => {
  if (!validator.isUUID(id))
    throw new apiError(StatusCode.BAD_REQUEST, "Invalid UUID");
  const deleted = await deleteDepartmentQuery(id);
  if (!deleted)
    throw new apiError(StatusCode.NOT_FOUND, "Department not found");

  return new apiResponse(
    StatusCode.SUCCESS,
    deleted,
    "Department deleted successfully",
  );
};


export {
  registerDepartmentService,
  getAllDepartmentService,
  getDepartmentByIdService,
  updateDepartmentService,
  deleteDepartmentService,
  getDepartmentStudentCountService,
  countCoursesPerDepartmentService,
}