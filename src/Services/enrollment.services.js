import { apiError } from "../utils/apiError";
import { StatusCode } from "../constants";
import { validateRequiredFields } from "../utils/validateRequiredFields";
import validator from "validator";

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

export {
  registerEnrollmentService,
  getEnrollmentByIdService,
  updateEnrollmentService,
  deleteEnrollmentService,
};
