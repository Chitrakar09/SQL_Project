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
    department_id: "department_id",
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
  const { rowCount } = await pool.query(query, [id]);
  return rowCount;
};

const getAllCoursesOfDepartmentQuery = async (department_id, conditions) => {
  const query = `SELECT c.course_code,c.course_name, d.department_name, COUNT(*) OVER() AS total_count from course c JOIN department d ON c.department_id=d.department_id WHERE d.department_id=$1 ORDER BY ${conditions.sortByColumn} ${conditions.sortOrderFinal} OFFSET $2 FETCH FIRST $3 ROW ONLY;`;
  const values = [department_id, conditions.skip, conditions.limitNumber];
  const { rows } = await pool.query(query, values);
  return rows;
};

const getCoursesBySemesterQuery = async () => {
  const query = `SELECT s.semester_no,ss.academic_year,STRING_AGG(c.course_code || '-' || c.course_name,',' ORDER BY course_name) AS courses FROM semester_session ss JOIN course c ON ss.course_id=c.course_id JOIN semester s ON ss.semester_id=s.semester_id GROUP BY (s.semester_no,ss.academic_year) ORDER BY s.semester_no,ss.academic_year;`;
  const { rows } = await pool.query(query);
  return rows;
};

const getCourseFullDetailQuery = async (courseId) => {
  const query = `SELECT c.course_id, c.course_code, c.course_name, c.credits, d.department_name,i.instructor_id, i.full_name , COUNT(DISTINCT e.student_id) as Student_count FROM enrollment e JOIN course c ON e.course_id=c.course_id JOIN department d ON c.department_id=d.department_id JOIN instructor_course ic ON c.course_id=ic.course_id JOIN instructor i ON ic.instructor_id=i.instructor_id WHERE c.course_id=$1 GROUP BY c.course_id,d.department_name,i.instructor_id;`;
  const { rows } = await pool.query(query, [courseId]);
  return rows[0];
};

const getCourseTaughtByInstructor = async (instructor_id) => {
  const query = `SELECT c.course_code, c.course_name FROM instructor_course ic JOIN course c ON ic.course_id=c.course_id WHERE ic.instructor_id=$1;`;
  const { rows } = await pool.query(query, [instructor_id]);
  return rows;
};

const getCoursesWithNoInstructorQuery = async () => {
  const query = `SELECT c.course_code,c.course_name FROM course c LEFT JOIN instructor_course ic ON c.course_id=ic.course_id WHERE ic.* IS NULL;`;
  const { rows } = await pool.query(query);
  return rows;
};

export {
  registerCourseQuery,
  getCourseByIdQuery,
  getAllCourseQuery,
  updateCourseQuery,
  deleteCourseQuery,
  getAllCoursesOfDepartmentQuery,
  getCoursesBySemesterQuery,
  getCourseFullDetailQuery,
  getCourseTaughtByInstructor,
  getCoursesWithNoInstructorQuery,
};
