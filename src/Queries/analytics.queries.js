import { pool } from "../db";

const getMostPopularCourseQuery = async () => {
  const query = `SELECT c.course_code,c.course_name,COUNT( * ) AS enrollment_count
FROM enrollment e
JOIN course c
ON e.course_id=c.course_id
GROUP BY c.course_code,c.course_name
ORDER BY enrollment_count DESC
LIMIT 1;`;
  const { rows } = await pool.query(query);
  return rows;
};

const getDepartmentStudentCountQuery = async () => {
  const query = `SELECT d.department_name, COUNT( * ) AS students_in_department_count FROM enrollment e JOIN course c ON e.course_id=c.course_id JOIN department d ON c.department_id=d.department_id GROUP by department_name;`;
  const { rows } = pool.query(query);
  return rows;
};

const countCoursesPerDepartmentQuery = async () => {
  const query = `SELECT d.department_name,COUNT( * ) AS course_count FROM course c JOIN department d ON c.department_id=d.department_id GROUP BY d.department_name;`;
  const { rows } = await pool.query(query);
  return rows[0];
};

const getStudentCountPerDepartmentQuery = async () => {
  const query = `SELECT d.department_name, COUNT(*) AS student_count FROM enrollment e JOIN course c ON e.course_id=c.course_id JOIN department d ON c.department_id=d.department_id GROUP BY d.department_name;`;
  const { rows } = await pool.query(query);
  return rows[0];
};

export {
  getMostPopularCourseQuery,
  getDepartmentStudentCountQuery,
  getStudentCountPerDepartmentQuery,
};
