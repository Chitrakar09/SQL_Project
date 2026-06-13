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
    semester_session_id: "semester_session_id",
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

  const query = `UPDATE enrollment SET ${setClauses.join(", ")} WHERE enrollment_id=$${values.length + 1} RETURNING *;`;

  values.push(id); // the last index of values is id.

  const { rows } = await pool.query(query, values);
  return rows[0];
};

const deleteEnrollmentQuery = async (id) => {
  const query = `DELETE FROM enrollment WHERE enrollment_id=$1;`;
  const { rowCount } = await pool.query(query, [id]);
  return rowCount;
};

const getAllStudentOfDepartmentQuery = async (departmentId, conditions) => {
  const query = `SELECT s.student_id, s.first_name,s.last_name,s.email,d.department_name, COUNT(*) OVER() AS total_count FROM enrollment e JOIN student s USING(student_id) JOIN course c ON e.course_id=c.course_id JOIN department d ON c.department_id=d.department_id WHERE d.department_id=$1 ORDER BY ${conditions.sortByColumn} ${conditions.sortOrderFinal} OFFSET $2 FETCH FIRST $3 ROW ONLY;`;

  const values = [departmentId, conditions.skip, conditions.limitNumber];

  const { rows } = await pool.query(query, values);
  return rows;
};



const getStudentByCoursesQuery = async (conditions) => {
  const query = `SELECT c.course_code || '-' || c.course_name AS course, s.student_id, s.first_name, s.last_name, e.enrollment_year, COUNT(*) OVER() AS total_count FROM enrollment e JOIN student s ON e.student_id=s.student_id JOIN course c ON e.course_id=c.course_id ORDER BY c.course_name ${conditions.sortOrderFinal} OFFSET $1 FETCH FIRST $2 ROW ONLY;`;
  const values = [conditions.skip, conditions.limitNumber];
  const { rows } = await pool.query(query, values);
  return rows;
};

const getStudentOfCourseQuery = async (course_code,conditions) => {
  const query = `SELECT c.course_code || '-' || c.course_name AS course, s.student_id, s.first_name, s.last_name, e.enrollment_year, COUNT(*) OVER() AS total_count FROM enrollment e JOIN student s ON e.student_id=s.student_id JOIN course c ON e.course_id=c.course_id WHERE c.course_code=$1 ORDER BY c.course_name ${conditions.sortOrderFinal} OFFSET $2 FETCH FIRST $3 ROW ONLY;`;
  const values = [course_code,conditions.skip, conditions.limitNumber];
  const { rows } = await pool.query(query, values);
  return rows;
};

const getStudentsWithoutEnrollmentQuery = async (conditions) => {
  const query = `SELECT s.student_id,s.first_name,s.last_name,s.email,s.admission_year, COUNT(*) OVER() AS total_count FROM student s LEFT JOIN enrollment e ON s.student_id=e.student_id WHERE e.* IS NULL ORDER BY ${conditions.sortByColumn} ${conditions.sortOrderFinal} OFFSET $1 FETCH FIRST $2 ROW ONLY;`;
  const values = [conditions.skip, conditions.limitNUmber];
  const { rows } = await pool.query(query, values);
  return rows;
};

export {
  registerEnrollmentQuery,
  getEnrollmentByIdQuery,
  updateEnrollmentQuery,
  deleteEnrollmentQuery,
  getAllStudentOfDepartmentQuery,
  getStudentByCoursesQuery,
  getStudentsWithoutEnrollmentQuery,
  getStudentOfCourseQuery
};
