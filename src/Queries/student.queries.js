import { pool } from "../db/index.js";

const registerStudentQuery = async ({
  first_name,
  last_name,
  email,
  phone,
  gender,
  dob,
  admission_year,
  current_status,
}) => {
  const query = `INSERT INTO student(
    first_name,
    last_name,
    email,
    phone,
    gender,
    d_o_b,
    enrollment_year,
    current_status
    )
    VALUES($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING *;`;

  const values = [
    first_name,
    last_name,
    email,
    phone,
    gender,
    dob,
    admission_year,
    current_status,
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

const getStudentByIdQuery = async (id) => {
  const query = `SELECT * FROM student WHERE student_id=$1;`;
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

const getAllStudentsQuery = async (conditions) => {
  const query = `SELECT *, COUNT(*) OVER() AS total_count FROM student ORDER BY ${conditions.sortByColumn} ${conditions.sortOrderFinal} OFFSET $1 FETCH FIRST $2 ROW ONLY;`;
  const values = [conditions.skip, conditions.limitNumber];
  const { rows } = await pool.query(query, values);
  return rows;
};

const updateStudentQuery = async (id, fields = {}) => {
  const columnMap = {
    first_name: "first_name",
    last_name: "last_name",
    email: "email",
    phone: "phone",
    gender: "gender",
    dob: "d_o_b",
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

  const query = `UPDATE student SET ${setClauses.join(", ")} WHERE student_id=$${values.length + 1} RETURNING *;`;

  values.push(id); // the last index of values is id.

  const { rows } = await pool.query(query, values);
  return rows[0];
};

const deactivateStudentQuery = async (id) => {
  const query = `UPDATE student SET current_status = 'inactive' WHERE student_id=$1 AND current_status = 'active' RETURNING *;`;
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};


export {
  registerStudentQuery,
  getStudentByIdQuery,
  getAllStudentsQuery,
  updateStudentQuery,
  deactivateStudentQuery,
};
