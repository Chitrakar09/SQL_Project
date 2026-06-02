CREATE TABLE course (
    course_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_code VARCHAR(20) NOT NULL UNIQUE,
    course_name VARCHAR(50) NOT NULL UNIQUE,
    credits INT NOT NULL,
    department_id UUID REFERENCES department(department_id)
)