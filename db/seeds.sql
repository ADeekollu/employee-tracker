USE employee_db;

INSERT INTO department (name)
VALUES 
("Sales"),
("Engineering"),
("Finance"),
("Human Resources");

INSERT INTO role (title, salary, department_id)
VALUES
("Sales Manager", 80000, 1),
("Account Executive", 60000, 1),
("Engineer Manager", 150000, 2),
("Software Engineer", 120000, 2),
("Finance Controller", 75000, 3),
("Accountant", 65000, 3),
("Director", 200000, 4),
("Human Resource Representative", 80000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
("Billy", "Bob", 1, NULL),
("Richie", "Rich", 2, 1),
("John", "Johnson", 3, NULL),
("Erin", "Andrews", 4, 3),
("Liz", "Taylor", 5, NULL),
("Mike", "Tyson", 6, 5),
("Sophia", "Dell", 7, NULL),
("Nate", "Russel", 8, 7);
