import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { StatusCode } from "../constants.js";
import { validateRequiredFields } from "../utils/validateRequiredFields.js";
import validator from "validator";
import {
  registerSemesterQuery,
  getSemesterByIdQuery,
  getAllSemesterQuery,
  updateSemesterQuery,
  deleteSemesterQuery,
  registerSemester_sessionQuery,
  getSemester_sessionByIdQuery,
  updateSemester_sessionQuery,
  deleteSemester_sessionQuery,
} from "../Queries/semester.queries.js";

const normalizeSemesterNumber = (value) => {
  const number = Number(value);
  if (!Number.isInteger(number) || number < 1 || number > 8) {
    throw new apiError(
      StatusCode.BAD_REQUEST,
      "semester_no must be an integer between 1 and 8",
    );
  }
  return number;
};

const normalizeDate = (value) => {
  if (value === undefined || value === null || value === "") return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new apiError(StatusCode.BAD_REQUEST, `Invalid date value: ${value}`);
  }
  return date.toISOString().split("T")[0];
};

// register semester
const registerSemesterService = async ({ semester_no }) => {
  validateRequiredFields({ semester_no });

  const normalizedSemesterData = {
    semester_no: normalizeSemesterNumber(semester_no),
  };

  const registeredSemester = await registerSemesterQuery(
    normalizedSemesterData,
  );
  if (!registeredSemester) {
    throw new apiError(
      StatusCode.INTERNAL_SERVER_ERROR,
      "Semester could not be registered",
    );
  }

  return new apiResponse(
    StatusCode.CREATED,
    registeredSemester,
    "Semester successfully registered",
  );
};

// get semester by Id
const getSemesterByIdService = async (id) => {
  if (!validator.isUUID(id))
    throw new apiError(StatusCode.BAD_REQUEST, "Invalid UUID");
  const semester = await getSemesterByIdQuery(id);
  if (!semester) throw new apiError(StatusCode.NOT_FOUND, "semester not found");

  return new apiResponse(StatusCode.SUCCESS, semester, "semester retrieved");
};

// get all students service
const getAllSemesterService = async ({ limit, page, sortOrder, sortBy }) => {
  const pageNumber = parseInt(page, 10) || 1;
  const limitNumber = parseInt(limit, 10) || 10;
  if (pageNumber < 1 || isNaN(pageNumber))
    throw new apiError(StatusCode.BAD_REQUEST, "Invalid page number");

  if (limitNumber < 1 || isNaN(limitNumber))
    throw new apiError(StatusCode.BAD_REQUEST, "Invalid limit");

  const skip = (pageNumber - 1) * limitNumber;
  const allowedSortFields = ["semester_no"];

  if (sortBy && !allowedSortFields.includes(sortBy)) {
    throw new apiError(StatusCode.BAD_REQUEST, "Invalid sort field");
  }

  const sortByColumn = sortBy || "semester_no";
  const sortOrderFinal =
    sortOrder?.toString().toLowerCase() === "desc" ? "DESC" : "ASC";

  const semesters = await getAllSemesterQuery({
    limitNumber,
    skip,
    sortByColumn,
    sortOrderFinal,
  });

  if (!semesters || semesters.length === 0) {
    return new apiResponse(
      StatusCode.SUCCESS,
      {
        semesters,
        pagination: {
          totalSemesters: 0,
          totalPages: 0,
          currentPage: pageNumber,
          limit: limitNumber,
          hasNextPage: false,
          hasPrevPage: false,
        },
      },
      "No semesters found",
    );
  }

  const totalSemesters = semesters[0].total_count ?? semesters.length;
  const totalPages = Math.ceil(totalSemesters / limitNumber);

  return new apiResponse(
    StatusCode.SUCCESS,
    {
      semesters,
      pagination: {
        totalSemesters,
        totalPages,
        currentPage: pageNumber,
        limit: limitNumber,
        hasNextPage: pageNumber < totalPages,
        hasPrevPage: pageNumber > 1,
      },
    },
    "Semesters retrieved successfully",
  );
};

// update semester service
const updateSemesterService = async (id, updates = {}) => {
  if (!validator.isUUID(id)) {
    throw new apiError(StatusCode.BAD_REQUEST, "Invalid UUID");
  }

  const { semester_no } = updates;
  if (semester_no === undefined) {
    throw new apiError(
      StatusCode.BAD_REQUEST,
      "semester_no is required to update",
    );
  }

  const normalized = {
    semester_no: normalizeSemesterNumber(semester_no),
  };

  const updatedSemester = await updateSemesterQuery(id, normalized);
  if (!updatedSemester)
    throw new apiError(StatusCode.NOT_FOUND, "Semester not found");

  return new apiResponse(
    StatusCode.SUCCESS,
    updatedSemester,
    "Semester information updated",
  );
};

// delete semester service
const deleteSemesterService = async (id) => {
  if (!validator.isUUID(id)) {
    throw new apiError(StatusCode.BAD_REQUEST, "Invalid UUID");
  }

  const deleted = await deleteSemesterQuery(id);
  if (!deleted) throw new apiError(StatusCode.NOT_FOUND, "Semester not found");

  return new apiResponse(
    StatusCode.SUCCESS,
    deleted,
    "Semester deleted successfully",
  );
};

// register semester session
const registerSemesterSessionService = async ({
  semester_id,
  academic_year,
  start_date,
  end_date,
  course_id,
}) => {
  validateRequiredFields({ semester_id, academic_year, course_id });

  if (!validator.isUUID(semester_id)) {
    throw new apiError(StatusCode.BAD_REQUEST, "Invalid semester_id UUID");
  }

  if (!validator.isUUID(course_id)) {
    throw new apiError(StatusCode.BAD_REQUEST, "Invalid course_id UUID");
  }

  const normalizedSemesterSessionData = {
    semester_id,
    academic_year: academic_year.toString().trim(),
    ...(start_date&&{start_date: normalizeDate(start_date)}),
    ...(end_date&&{end_date: normalizeDate(end_date)}),
    course_id,
  };

  const registeredSemesterSession = await registerSemester_sessionQuery(
    normalizedSemesterSessionData,
  );
  if (!registeredSemesterSession) {
    throw new apiError(
      StatusCode.INTERNAL_SERVER_ERROR,
      "Semester session could not be registered",
    );
  }

  return new apiResponse(
    StatusCode.CREATED,
    registeredSemesterSession,
    "Semester session successfully registered",
  );
};

const getSemesterSessionByIdService = async (id) => {
  if (!validator.isUUID(id)) {
    throw new apiError(StatusCode.BAD_REQUEST, "Invalid UUID");
  }

  const session = await getSemester_sessionByIdQuery(id);
  if (!session)
    throw new apiError(StatusCode.NOT_FOUND, "Semester session not found");

  return new apiResponse(
    StatusCode.SUCCESS,
    session,
    "Semester session retrieved successfully",
  );
};

const updateSemesterSessionService = async (id, updates = {}) => {
  if (!validator.isUUID(id)) {
    throw new apiError(StatusCode.BAD_REQUEST, "Invalid UUID");
  }

  const { start_date, end_date } = updates;
  if (
    semester_id === undefined &&
    start_date === undefined &&
    end_date === undefined
  ) {
    throw new apiError(
      StatusCode.BAD_REQUEST,
      "At least one field is required to update",
    );
  }

  const normalized = {
    ...(semester_id !== undefined && {
      semester_id: validator.isUUID(semester_id)
        ? semester_id
        : (() => {
            throw new apiError(
              StatusCode.BAD_REQUEST,
              "Invalid semester_id UUID",
            );
          })(),
    }),
    ...(start_date !== undefined && { start_date: normalizeDate(start_date) }),
    ...(end_date !== undefined && { end_date: normalizeDate(end_date) }),
  };

  const updatedSession = await updateSemester_sessionQuery(id, normalized);
  if (!updatedSession)
    throw new apiError(StatusCode.NOT_FOUND, "Semester session not found");

  return new apiResponse(
    StatusCode.SUCCESS,
    updatedSession,
    "Semester session information updated",
  );
};

// delete semester SESSION service
const deleteSemesterSessionService = async (id) => {
  if (!validator.isUUID(id)) {
    throw new apiError(StatusCode.BAD_REQUEST, "Invalid UUID");
  }

  const deleted = await deleteSemester_sessionQuery(id);
  if (!deleted) throw new apiError(StatusCode.NOT_FOUND, "Semester session not found");

  return new apiResponse(
    StatusCode.SUCCESS,
    deleted,
    "Semester session deleted successfully",
  );
};

export {
  registerSemesterService,
  getSemesterByIdService,
  getAllSemesterService,
  updateSemesterService,
  deleteSemesterService,
  registerSemesterSessionService,
  getSemesterSessionByIdService,
  updateSemesterSessionService,
  deleteSemesterSessionService
};
