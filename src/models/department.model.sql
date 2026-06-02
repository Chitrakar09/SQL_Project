CREATE TABLE department(
department_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
department_name VARCHAR(100) NOT NULL UNIQUE,
building VARCHAR(20),
office_number VARCHAR(10)
);