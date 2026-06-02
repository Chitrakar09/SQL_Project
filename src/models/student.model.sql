CREATE TABLE student (
    student_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(250) UNIQUE NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL CHECK(phone ~ '^[0-9]{10,15}$'),
    gender VARCHAR(20) CHECK(LOWER(gender) IN('male','female','other')),
    d_o_b DATE NOT NULL,
    admission_year INT,
    current_status VARCHAR(20) CHECK(lower(current_status) IN ('active','graduated','inactive'))
);