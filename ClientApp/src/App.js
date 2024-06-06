import React, { useState, useEffect } from 'react';
export default function () {

    const [employeeData, setEmployeeData] = useState([]);
    const [empNameInput, setEmpNameInput] = useState("");
    const [empValueInput, setEmpValueInput] = useState("");
    async function getEmployees() {
        return fetch("/employees").then(response => response.json());
    }

    async function createEmployee(name, value) {
        return fetch("/employees", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name, value: value })
        });
    }

    async function updateEmployee(name, value) {
        return fetch("/employees", {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name, value: value })
        });
    }

    useEffect(() => {
        getEmployees()
            .then(data => {
                setEmployeeData(data);
            })
            .catch(error => {
                console.error("Failed to fetch employees:", error);
            });
    }, []);

    const changeEmpName = event => {
        setEmpNameInput(event.target.value);
    }

    const changeEmpValue = event => {
        setEmpValueInput(event.target.value);
    }


    return (
        <div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <p>Name:</p>
                    <input
                        value={empNameInput}
                        onChange={changeEmpName}
                    />
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <p>Value:</p>
                    <input
                        value={empValueInput}
                        onChange={changeEmpValue}
                    />
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <button onClick={AddEmployee}>Add Employee</button>
                    <button onClick={EditEmployee}>Edit Employee</button>
                </div>
            </div>
            <ul style={{ display: 'flex', flexDirection: 'row' }}>
                <EmployeeList employees={employeeData} />
            </ul>
        </div>
    );


    function EmployeeList(props) { //takes an employee json and returns it as an html list
        const employees = props.employees.map(employee => <li>{employee.name} {employee.value}</li>)
        return <p>{employees}</p>
    }

    function AddEmployee() { //validates input and calls database
        if (employeeData.map(employee => employee.name).includes(empNameInput)) { //Check if employee name already exists
            alert("Employee with name '" + empNameInput + "' already exists")
        }

        else {
            createEmployee(empNameInput, empValueInput)
            alert("Employee '" + empNameInput + "' added")
            getEmployees()
                .then(data => {
                    setEmployeeData(data);
                })
                .catch(error => {
                    console.error("Failed to fetch employees:", error);
                });
        }
    }

    function EditEmployee() { //validates input and calls database
        if (!employeeData.map(employee => employee.name).includes(empNameInput)) { //Check if employee name being edited exists
            alert("Employee with name '" + empNameInput + "' does not exist")
        }

        else {
            updateEmployee(empNameInput, empValueInput)
            getEmployees()
                .then(data => {
                    setEmployeeData(data);
                })
                .catch(error => {
                    console.error("Failed to fetch employees:", error);
                });
            alert("Employee '" + empNameInput + "' edited")
        }
    }
}
