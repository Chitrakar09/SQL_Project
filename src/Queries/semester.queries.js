import { pool } from "../db/index.js";

const registerSemesterQuery = async ({ semester_no }) => {
  const query = `INSERT INTO semester(
    semester_no,
    )
    VALUES($1)
    RETURNING *;`;

  const values = [semester_no];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

const getSemesterByIdQuery = async (id) => {
  const query = `SELECT * FROM semester WHERE semester_id=$1;`;
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

const getAllSemesterQuery = async (conditions) => {
  const query = `SELECT *, COUNT(*) OVER() AS total_count FROM semester ORDER BY ${conditions.sortByColumn} ${conditions.sortOrderFinal} OFFSET $1 FETCH FIRST $2 ROW ONLY;`;
  const values = [conditions.skip, conditions.limitNumber];
  const { rows } = await pool.query(query, values);
  return rows;
};

const updateSemesterQuery = async (id, { semester_no }) => {
  const query = `UPDATE semester SET semester_no=$1 WHERE semester_id=$2 RETURNING *;`;

  const { rows } = await pool.query(query, [semester_no, id]);
  return rows[0];
};

const deleteSemesterQuery = async (id) => {
  const query = `DELETE FROM semester WHERE semester_id=$1;`;
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

const registerSemester_sessionQuery = async ({
  semester_id,
  academic_year,
  start_date,
  end_date,
  course_id,
}) => {
  const columns = ["semester_id", "academic_year", "course_id"];
  const values = [semester_id, academic_year, course_id];
  if (start_date) {
    columns.push("start_date");
    values.push(start_date);
  }
  if(end_date){
    columns.push("end_date");
    values.push(end_date);
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

const getSemester_sessionByIdQuery = async (id) => {
  const query = `SELECT * FROM semester_session WHERE semester_session_id=$1;`;
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

const updateSemester_sessionQuery = async (id, fields = {}) => {
  const columnMap = {
    semester_id: "semester_id",
    start_date: "start_date",
    end_date: "end_date",
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

  const query = `UPDATE semester_session SET ${setClauses.join(", ")} WHERE semester_session_id=$${values.length + 1} RETURNING *;`;

  values.push(id); // the last index of values is id.

  const { rows } = await pool.query(query, values);
  return rows[0];
};

const deleteSemester_sessionQuery = async (id) => {
  const query = `DELETE FROM semester_session WHERE semester_session_id=$1;`;
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

export {
  registerSemesterQuery,
  getSemesterByIdQuery,
  getAllSemesterQuery,
  updateSemesterQuery,
  deleteSemesterQuery,
};
