CREATE TABLE instructor (
    instructor_id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    full_name VARCHAR(50) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    hire_date INT NOT NULL,
    department_id UUID REFERENCES department (department_id) UNIQUE, 
    current_status VARCHAR(20) CHECK (
        lower(current_status) IN (
            'active',
            'on_leave',
            'inactive',
            'resigned',
            'retired'
        )
    ),
);

CREATE TABLE instructor_course (
    instructor_id UUID REFERENCES instructor (instructor_id) ON DELETE CASCADE,
    course_id UUID REFERENCES course (course_id) ON DELETE CASCADE,
    PRIMARY KEY (instructor_id, course_id)
);