import { pool } from "../db/index.js";

const registerDepartmentQuery = async ({
  department_name,
  building,
  office_number,
}) => {
  const query = `INSERT INTO department(
    department_name,
    building,
    office_number,
    )
    VALUES($1,$2,$3)
    RETURNING *;`;

  const values = [department_name, building, office_number];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

const getDepartmentByIdQuery = async (id) => {
  const query = `SELECT * FROM department WHERE department_id=$1;`;
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

const getAllDepartmentQuery = async (conditions) => {
  const query = `SELECT *, COUNT(*) OVER() AS total_count FROM department ORDER BY ${conditions.sortByColumn} ${conditions.sortOrderFinal} OFFSET $1 FETCH FIRST $2 ROW ONLY;`;
  const values = [conditions.skip, conditions.limitNumber];
  const { rows } = await pool.query(query, values);
  return rows;
};

const updateDepartmentQuery = async (id, fields = {}) => {
  const columnMap = {
    department_name: "depart_name",
    building: "building",
    office_number: "office_number",
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

  const query = `UPDATE department SET ${setClauses.join(", ")} WHERE department_id=$${values.length + 1} RETURNING *;`;

  values.push(id); // the last index of values is id.

  const { rows } = await pool.query(query, values);
  return rows[0];
};

const deleteDepartmentQuery = async (id) => {
  const query = `DELETE FROM department WHERE department_id=$1;`;
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

export {
  registerDepartmentQuery,
  getDepartmentByIdQuery,
  getAllDepartmentQuery,
  updateDepartmentQuery,
  deleteDepartmentQuery,
};
