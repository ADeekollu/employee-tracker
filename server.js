

const mysql = require("mysql2");
const inquirer = require("inquirer");
const cTable = require('console.table');
const figlet = require('figlet');

require("dotenv").config()

const db = mysql.createConnection({
    host:'localhost',
    user:process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database:process.env.DB_NAME
})
db.connect(function(){
    console.log("Welecome to Employee Tracker Application");
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
            default:
                db.end()
                process.exit(0);
        }
    })
}


function viewDepartments(){
    db.query("select * from department;",function(err,data){
        if(err) throw err;
        cTable(data)
        promtUser()
    })
}

function viewEmployees(){
    db.query("select e.first_name,e.last_name,e.role_id, r.title,r.salary,d.name from employee e,role r, department d where r.id = e.role_id and r.department_id = d.id;",
    function(err,data){
        if(err) throw err;
        cTable(data)
        promtUser()
    })
}

function viewRoles(){
    db.query("select * from role;",function(err,data){
        if(err) throw err;
        cTable(data)
        promtUser()
    })
}

function addDepartment(){
    inquirer.prompt([
        {
            type:"input",
            message:"Enter department name: ",
            name:"dname"
        }
    ]).then(respone => {
        db.query("INSERT INTO department (name) VALUES (?);",
        response.dname,function(err,data){
            if(err) throw err;
            cTable(data)
            promtUser()
        })
    })
}