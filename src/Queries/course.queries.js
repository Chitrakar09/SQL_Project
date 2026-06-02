import { pool } from "../db/index.js";

const registerCourseQuery = async ({
  course_code,
  course_name,
  credits,
  department_id,
}) => {
  const columns = ["course_code", "course_name", "credits"];

  const values = [course_code, course_name, credits];

  if (department_id) {
    columns.push("department_id");
    values.push(department_id);
  }

  const placeholders = values.map((_, index) => `$${index + 1}`);

  const query = `
  INSERT INTO course (
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

const getCourseByIdQuery = async (id) => {
  const query = `SELECT * FROM course WHERE course_id=$1;`;
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

const getAllCourseQuery = async (conditions) => {
  const query = `SELECT *, COUNT(*) OVER() AS total_count FROM course ORDER BY ${conditions.sortByColumn} ${conditions.sortOrderFinal} OFFSET $1 FETCH FIRST $2 ROW ONLY;`;
  const values = [conditions.skip, conditions.limitNumber];
  const { rows } = await pool.query(query, values);
  return rows;
};

const updateCourseQuery = async (id, fields = {}) => {
  const columnMap = {
    course_code: "course_code",
    course_name: "course_name",
    credits: "credits",
    department_id:"department_id"
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

  const query = `UPDATE course SET ${setClauses.join(", ")} WHERE course_id=$${values.length + 1} RETURNING *;`;

  values.push(id); // the last index of values is id.

  const { rows } = await pool.query(query, values);
  return rows[0];
};

const deleteCourseQuery = async (id) => {
  const query = `DELETE FROM course WHERE course_id=$1;`;
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

export {
  registerCourseQuery,
  getCourseByIdQuery,
  getAllCourseQuery,
  updateCourseQuery,
  deleteCourseQuery,
};
