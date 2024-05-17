const express = require('express');
const sql = require('mssql');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// SQL Server configuration
const config = {
    HOST: "localhost",
  PORT: 1434, // Corrected: PORT should be a number, not a string
  user: 'sa',
  password: '123456',
  server: 'DESKTOP-MIEVJ2U', // Replace 'your_server_ip' with the actual IP address of your MSSQL server
  database: 'Akshata',
  dialect: "mssql",
    options: {
        encrypt: true, // for Azure
        trustServerCertificate: true // change to true for local dev / self-signed certs
    }
};

// Connect to the SQL Server database
sql.connect(config).then(pool => {
    if (pool.connected) {
        console.log('Connected to SQL Server');
    }

     // Define a route to insert data into the database
     app.post('/data', async (req, res) => {
        const { EmpName, Designation, Location, Salary } = req.body;
        if (!EmpName || !Designation || !Location || !Salary) {
            return res.status(400).send({ message: 'All fields are required' });
        }
        try {
            await pool.request()
                .input('EmpName', sql.VarChar, EmpName)
                .input('Designation', sql.VarChar, Designation)
                .input('Location', sql.VarChar, Location)
                .input('Salary', sql.Decimal, Salary)
                .query('INSERT INTO Employees1 (EmpName, Designation, Location, Salary) VALUES (@EmpName, @Designation, @Location, @Salary)');
            res.status(201).send({ message: 'Data inserted successfully' });
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    });


    // Define a route to get data from the database
    app.get('/data', async (req, res) => {
        try {
            const result = await pool.request().query('SELECT * FROM Employees1');
            res.json(result.recordset);
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    });

    // Define a route to update data in the database
    app.put('/data/:EmpId', async (req, res) => {
        const { EmpId } = req.params;
        const { EmpName, Designation, Location, Salary } = req.body;
        if (!EmpName || !Designation || !Location || !Salary) {
            return res.status(400).send({ message: 'All fields are required' });
        }
        try {
            await pool.request()
                .input('EmpId', sql.Int, EmpId)
                .input('EmpName', sql.VarChar, EmpName)
                .input('Designation', sql.VarChar, Designation)
                .input('Location', sql.VarChar, Location)
                .input('Salary', sql.Decimal, Salary)
                .query('UPDATE Employees1 SET EmpName = @EmpName, Designation = @Designation, Location = @Location, Salary = @Salary WHERE EmpId = @EmpId');
            res.status(200).send({ message: 'Data updated successfully' });
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    });

    // Define a route to delete data from the database
    app.delete('/data/:EmpId', async (req, res) => {
        const { EmpId } = req.params;
        try {
            await pool.request()
                .input('EmpId', sql.Int, EmpId)
                .query('DELETE FROM Employees1 WHERE EmpId = @EmpId');
            res.status(200).send({ message: 'Data deleted successfully' });
        } catch (err) {
            res.status(500).send({ message: err.message });
        }
    });

}).catch(err => {
    console.error('Database connection failed', err);
    process.exit(1);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
