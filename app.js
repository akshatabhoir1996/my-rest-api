const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');

const app = express();
const port = 3000;

app.use(bodyParser.json());

module.exports = {
  HOST: "localhost",
  PORT: 1434, // Corrected: PORT should be a number, not a string
  user: 'sa',
  password: '123456',
  server: 'DESKTOP-MIEVJ2U', // Replace 'your_server_ip' with the actual IP address of your MSSQL server
  database: 'Akshata',
  dialect: "mssql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

// Helper function to generate SET clause for UPDATE operation
const generateSetClause = (columns, values) => {
  return columns.map((col, index) => `${col} = '${values[index]}'`).join(', ');
};
app.get('/hello/api', async (req,res) => {
 res.status(200).send({message:'haha'})
})
app.post('/api/insert', async (req, res) => {
  try {
    console.log('yaha aa gaya');

    await sql.connect(config);

    const { orders, columns, values } = req.body;

    if (!Array.isArray(columns) || !Array.isArray(values) || columns.length !== values.length) {
      return res.status(400).send('Invalid request body');
    }

    const columnNames = columns.join(', ');
    const columnValues = values.map(value => `'${value}'`).join(', ');

    const result = await sql.query(`SELECT TOP (1000) [order_id], [customer_id], [order_date], [total_amount] FROM ${orders}`);
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  } finally {
    sql.close();
  }
});

app.get('/api/select/:orders', async (req, res) => {
  try {
    await sql.connect(config);

    const orders = req.params.orders;

    const { columns, conditions } = req.query;

    let query = `SELECT ${columns || '*'} FROM ${orders}`;
    if (conditions) {
      query += ` WHERE ${conditions}`;
    }

    const result = await sql.query(query);
    res.send(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  } finally {
    sql.close();
  }
});

app.put('/api/update/:orders/:id', async (req, res) => {
  try {
    await sql.connect(config);

    const orders = req.params.orders;
    const id = req.params.id;
    const { columns, values } = req.body;

    if (!Array.isArray(columns) || !Array.isArray(values) || columns.length !== values.length) {
      return res.status(400).send('Invalid request body');
    }

    const setClause = generateSetClause(columns, values);

    const result = await sql.query(`UPDATE ${orders} SET ${setClause} WHERE id = ${id}`);
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  } finally {
    sql.close();
  }
});

app.delete('/api/delete/:orders/:id', async (req, res) => {
  try {
    await sql.connect(config);

    const orders = req.params.orders;
    const id = req.params.id;

    const result = await sql.query(`DELETE FROM ${orders} WHERE id = ${id}`);
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  } finally {
    sql.close();
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});