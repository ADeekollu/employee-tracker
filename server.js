

const mysql = require("mysql2");
const inquirer = require("inquirer");
const cTable = require('console.table');
const figlet = require('figlet');
const { response } = require("express");

require("dotenv").config()

const db = mysql.createConnection({
    host:'localhost',
    user:process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database:process.env.DB_NAME
})
db.connect(function(){
    console.log("Welecome to the Employee Tracker Application");
    figlet('Employee Tracker', function(err, data) {
        if(err) {
            console.log("Something Went Wrong")            
        } else {
            console.log(data);
        }        
        promptUser();
    });
});

const promptUser = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'choices',
            message: 'What action would you like to take?',
            choices: ['View all departments',
                    'View all roles',
                    'View all employees',
                    'Add a department',
                    'Add a role',
                    'Add an employee',
                    'Update an employee role',
                    'Update employee manager',
                    'View employees by manager',
                    'Delete a department',
                    'Delete a role',
                    'Delete an employee',
                    'View the total utilized budget of a department',
                    'Exit App'

            ]
        }
    ]).then(response => {
        switch(response.choices){
            case 'View all departments':
                viewDepartments();
                break;
            case 'View all roles':
                viewRoles();
                break;
            case 'View all employees':
                viewEmployees();
                break;
            case 'Add a department':
                addDepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Update an employee role':
                updateEmployeeRole();
                break;
            case 'Update employee manager':
                updateEmployeeManager();
                break;
            case 'View employees by manager':
                viewEmployeeManager();
                break;
            case 'Delete a department':
                deleteDepartment();
                break;
            case 'Delete a role':
                deleteRole();
                break;
            case 'Delete an employee':
                deleteEmployee();
                break;
            case 'View the total utilized budget of a department':
                viewBudget();
                break;                   
            default:
                db.end()
                process.exit(0);
        }
    })
    .catch(err => {
        console.log(err);
    });
}


function viewDepartments(){
    db.query("select * from department;",(err,data) => {
        if(err) throw err;
        console.table(data);
        promptUser();
    });
};

function viewEmployees(){
    db.query("select e.first_name,e.last_name,e.role_id, r.title,r.salary,d.name from employee e,role r, department d where r.id = e.role_id and r.department_id = d.id;",
        (err,data) => {
        if(err) throw err;
        console.table(data);
        promptUser();
    });
};

function viewRoles(){
    db.query("select * from role;", (err,data) =>{
        if(err) throw err;
        console.table(data);
        promptUser();
    });
};

function addDepartment(){
    inquirer.prompt([
        {
            type:"input",
            message:"Enter department name: ",
            name:"name"
        }
    ]).then(response => {
        db.query("INSERT INTO department (name) VALUES (?)",
        [response.name], (err,data) => {
            if(err) throw err;
            console.log(`Inserted ${response.name} into departments as ID ${response.insertId}`);
            console.table(data);
            promptUser();
        });
    });    
};

function addRole() {
    const department = [];
    db.query("select * from department", (err,res) => {
        if(err) throw err;
        
        res.forEach(dep => {
            let questionObject = {
                name: dep.name,
                value: dep.id
            }
            department.push(questionObject);
        })
        let questions = [
            {
                type: "input",
                name: "title",
                message: "What is the title of the new role?"
            },
            {
                type: "input",
                name: "salary",
                message: "What is the salary of the new role?"
            },
            {
                type: "list",
                name: "department",
                choices: department,
                message: "Which department is this role in?"
            }
        ];

        inquirer.prompt(questions)
         .then(response => {
            const query = `insert into role (title, salary, department_id) values (?)`;
            db.query(query, [[response.title, response.salary, response.department]], (err, res) => {
                if(err) throw err;
                console.log(`Inserted ${response.title} role at ID ${res.insertId}`);
                console.table(res);
                promptUser();
            });
         });
    });
};

function addEmployee() {
    db.query("select * from employee" , (err, empResponse) => {
        if(err) throw err;
        const employeeChoice = [
            {
                name: 'None',
                value: 0
            }
        ];
        empResponse.forEach(({ first_name, last_name, id}) => {
            employeeChoice.push({
                name: first_name + " " + last_name,
                value: id
            });
        });
        db.query('select * from role', (err, roleResponse) => {
            if(err) throw err;
            const roleChoice = [];
            roleResponse.forEach(({ title, id }) => {
                roleChoice.push({
                    name: title,
                    value: id
                })
            })
        let questions = [
            {
                type: "input",
                name: "first_name",
                message: "What is the employee's first name?"
            },
            {
                type: "input",
                name: "last_name",
                message: "What is the employee's last name?"
            },
            {
                type: "list",
                name: "role_id",
                choices: roleChoice,
                message: "What is the employee's role?"
            },
            {
                type: "list",
                name: "manager_id",
                choices: employeeChoice,
                message: "Who is the employee's manager?"
            }     
           
        ]

        inquirer.prompt(questions)
            .then(response => {
                const query = `insert into employee (first_name, last_name, role_id, manager_id) values (?)`;
                let manager_id = response.manager_id !==0? response.manager_id: null;
                db.query(query, [[response.first_name, response.last_name, response.role_id, manager_id]], (err, res) => {
                    if(err) throw err;
                    console.log(`Inserted Employee ${response.first_name} ${response.last_name} with ID ${res.insertId}`);
                    console.table(res);
                    promptUser();
                });
            });
        });
    });
};