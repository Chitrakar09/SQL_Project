import { pool } from "../db/index.js";

const registerEnrollmentQuery = async ({
  student_id,
  course_id,
  semester_session_id,
  current_status,
  enrollment_year,
}) => {
  const columns = [
    "student_id",
    "course_id",
    "semester_session_id",
    "current_status",
    "enrollment_year",
  ];

  const values = [
    student_id,
    course_id,
    semester_session_id,
    current_status,
    enrollment_year,
  ];

  const placeholders = values.map((_, index) => `$${index + 1}`);

  const query = `
  INSERT INTO enrollment (
    ${columns.join(", ")}
  )
  VALUES (
    ${placeholders.join(", ")}
  )
  RETURNING *;
`;

  const { rows } = await pool.query(query, values);

  return rows[0];
};

const getEnrollmentByIdQuery = async (id) => {
  const query = `SELECT * FROM enrollment WHERE enrollment_id=$1;`;
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

const updateEnrollmentQuery = async (id, fields = {}) => {
  const columnMap = {
    semester_session_id:"semester_session_id",
    current_status:"current_status"
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

  const query = `UPDATE enrollment SET ${setClauses.join(", ")} WHERE enrollment_id=$${values.length + 1} RETURNING *;`;

  values.push(id); // the last index of values is id.

  const { rows } = await pool.query(query, values);
  return rows[0];
};

const deleteEnrollmentQuery = async (id) => {
  const query = `DELETE FROM enrollment WHERE enrollment_id=$1;`;
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

export {
  registerEnrollmentQuery,
  getEnrollmentByIdQuery,
  updateEnrollmentQuery,
  deleteEnrollmentQuery,
};
