import { StatusCode } from "../constants.js";
import { pool } from "../db/index.js";
import { apiError } from "../utils/apiError.js";

const registerInstructorQuery = async ({
  full_name,
  email,
  hire_date,
  department_id,
  current_status,
}) => {
  const columns = ["full_name", "email", "hire_date", "current_status"];
  const values = [full_name, email, hire_date, current_status];
  if (department_id) {
    columns.push("department_id");
    values.push(department_id);
  }

  const placeholders = values.map((_, index) => `$${index + 1}`);

  const query = `INSERT INTO instructor(
        ${columns.join(", ")}
    )
    VALUES(
        ${placeholders.join(", ")}
    )
    RETURNING *;`;

  const { rows } = await pool.query(query, values);
  return rows[0];
};

const getInstructorByIdQuery = async (id) => {
  const query = `SELECT * FROM instructor WHERE instructor_id=$1;`;
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

const getAllInstructorsQuery = async (conditions) => {
  const query = `SELECT *, COUNT(*) OVER() AS total_count FROM instructor ORDER BY ${conditions.sortByColumn} ${conditions.sortOrderFinal} OFFSET $1 FETCH FIRST $2 ROW ONLY;`;
  const values = [conditions.skip, conditions.limitNumber];
  const { rows } = await pool.query(query, values);
  return rows;
};

const updateInstructorQuery = async (id, fields = {}) => {
  const columnMap = {
    full_name: "full_name",
    email: "email",
    department_id: "department_id",
    current_status: "current_status",
  };

  const setClauses = [];
  const values = [];

  Object.entries(fields).forEach(([key, value]) => {
    const column = columnMap[key];
    if (column) {
      setClauses.push(`${column}=$${values.length + 1}`);
      values.push(value);
    }
  });

  if (!setClauses.length) return null;

  const query = `UPDATE instructor SET ${setClauses.join(", ")} WHERE instructor_id=$${values.length + 1} RETURNING *;`;

  values.push(id); // the last index of values is id.

  const { rows } = await pool.query(query, values);
  return rows[0];
};

const deactivateInstructorQuery = async (id) => {
  const query = `UPDATE instructor SET current_status = 'inactive' WHERE instructor_id=$1 AND current_status = 'active' RETURNING *;`;
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};
const assignInstructorCourseQuery = async ({
  instructor_email,
  course_code,
}) => {
  const getInstructorIdQuery =
    "SELECT instructor_id from instructor WHERE email=$1";

  const instructorResult = await pool.query(getInstructorIdQuery, [
    instructor_email,
  ]);

  if (instructorResult.rows.length === 0)
    throw new apiError(StatusCode.NOT_FOUND, "Instructor not found");

  const instructor_id = instructorResult.rows[0].instructor_id;

  const getCourseIdQuery = "SELECT course_id from course WHERE course_code=$1";

  const courseResult = await pool.query(getCourseIdQuery, [course_code]);

  if (courseResult.rows.length === 0)
    throw new apiError(StatusCode.NOT_FOUND, "Instructor not found");

  const course_id = courseResult.rows[0].course_id;

  const query = `INSERT INTO instructor_course(
    instructor_id, course_id
    ) VALUES ($1,$2)
    RETURNING * 
    ;`;

  const { rows } = await pool.query(query, [instructor_id, course_id]);

  return rows[0];
};

const getInstructorCourseByIdQuery = async (id) => {
  const query = `SELECT * FROM instructor_course WHERE instructor_id=$1;`;
  const { rows } = await pool.query(query, id);
  return rows[0];
};

const updateInstructorCourseQuery = async (
  id,
  { toBeUpdatedCourseId, updatedCourseId },
) => {
  const query = `UPDATE instructor_course SET course_id=$1 WHERE instructor_id=$2 AND course_id=$3;`;
  const { rows } = await pool.query(query, [
    updatedCourseId,
    id,
    toBeUpdatedCourseId,
  ]);
  return rows[0];
};

const unAssignInstructorCourseQuery = async ({ instructor_id, course_id }) => {
  const query = `DELETE FROM instructor_course WHERE instructor_id=$1 AND course_id=$2;`;
  const { rows } = await pool.query(query, [instructor_id, course_id]);
  return rows[0];
};

export {
  registerInstructorQuery,
  getInstructorByIdQuery,
  getAllInstructorsQuery,
  updateInstructorQuery,
  deactivateInstructorQuery,
  assignInstructorCourseQuery,
  getInstructorCourseByIdQuery,
  updateInstructorCourseQuery,
  unAssignInstructorCourseQuery,
};
