document.addEventListener('DOMContentLoaded', function () {
    const employeeForm = document.getElementById('employeeForm');
    const employeeList = document.getElementById('employeeList');
    const formButton = document.getElementById('formButton');
    let isUpdating = false;
    let currentEmpId = null;
  
    // Function to fetch data from server and update table
    function fetchData() {
        fetch('http://localhost:3000/data')
            .then(response => response.json())
            .then(data => {
                employeeList.innerHTML = ''; // Clear existing table rows
                data.forEach(employee => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${employee.EmpId}</td>
                        <td>${employee.EmpName}</td>
                        <td>${employee.Designation}</td>
                        <td>${employee.Location}</td>
                        <td>${employee.Salary}</td>
                        <td>
                            <button onclick="editEmployee(${employee.EmpId}, '${employee.EmpName}', '${employee.Designation}', '${employee.Location}', ${employee.Salary})">Edit</button>
                            <button onclick="deleteEmployee(${employee.EmpId})">Delete</button>
                        </td>
                    `;
                    employeeList.appendChild(row);
                });
            })
            .catch(error => console.error('Error fetching data:', error));
    }
  
    // Function to handle form submission for both add and update
    employeeForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const empName = document.getElementById('empName').value;
        const designation = document.getElementById('designation').value;
        const location = document.getElementById('location').value;
        const salary = document.getElementById('salary').value;
  
        const employeeData = {
            EmpName: empName,
            Designation: designation,
            Location: location,
            Salary: salary
        };
  
        if (isUpdating) {
            // Update existing employee
            fetch(`http://localhost:3000/data/${currentEmpId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(employeeData)
            })
            .then(response => response.json())
            .then(data => {
                console.log('Data updated successfully:', data);
                fetchData(); // Refresh table with updated data
                resetForm();
            })
            .catch(error => console.error('Error updating data:', error));
        } else {
            // Add new employee
            fetch('http://localhost:3000/data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(employeeData)
            })
            .then(response => response.json())
            .then(data => {
                console.log('Data added successfully:', data);
                fetchData(); // Refresh table with updated data
                resetForm();
            })
            .catch(error => console.error('Error adding data:', error));
        }
    });
  
    // Function to edit employee
    window.editEmployee = function (empId, empName, designation, location, salary) {
        currentEmpId = empId;
        document.getElementById('empId').value = empId;
        document.getElementById('empName').value = empName;
        document.getElementById('designation').value = designation;
        document.getElementById('location').value = location;
        document.getElementById('salary').value = salary;
        formButton.textContent = 'Update Employee';
        isUpdating = true;
    };
  
    // Function to delete employee
    window.deleteEmployee = function (empId) {
        fetch(`http://localhost:3000/data/${empId}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            console.log('Data deleted successfully:', data);
            fetchData(); // Refresh table with updated data
        })
        .catch(error => console.error('Error deleting data:', error));
    };
  
    // Function to reset form
    function resetForm() {
        document.getElementById('empId').value = '';
        document.getElementById('empName').value = '';
        document.getElementById('designation').value = '';
        document.getElementById('location').value = '';
        document.getElementById('salary').value = '';
        formButton.textContent = 'Add Employee';
        isUpdating = false;
        currentEmpId = null;
    }
  
    // Initial data fetch
    fetchData();
  });