const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));

const port = 3505;

const cors = require("cors");
app.use(cors());

const { Pool } = require("pg");
const pool = new Pool({
  user: "user_3505", // PostgreSQLのユーザー名に置き換えてください
  host: "db",
  database: "crm_3505", // PostgreSQLのデータベース名に置き換えてください
  password: "pass_3505", // PostgreSQLのパスワードに置き換えてください
  port: 5432,
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

//顧客一覧
app.get("/customers", async (req, res) => {
  try {
    const customerData = await pool.query("SELECT * FROM customers ORDER BY customer_id");
    res.send(customerData.rows);
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//顧客追加
app.post("/add-customer", async (req, res) => {
  try {
    const { companyName, industry, contact, location } = req.body;
    const newCustomer = await pool.query(
      "INSERT INTO customers (company_name, industry, contact, location) VALUES ($1, $2, $3, $4) RETURNING *",
      [companyName, industry, contact, location]
    );
    res.json({ success: true, customer: newCustomer.rows[0] });
  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});

// 顧客詳細
app.get("/customer/:customerId", async (req, res) => {
  try {
    const id = req.params.customerId;
    const customerData = await pool.query("SELECT * FROM customers WHERE customer_id = $1", [id]);
    res.send(customerData.rows[0]);
  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});

// 顧客削除
app.delete("/delete-customer/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await pool.query("DELETE FROM customers WHERE customer_id = $1", [id]);

    res.json({ success: true, message: `Customer ${id} has been deleted` });
  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});

// 顧客編集
app.post("/update-customer/:id", async (req, res) => {
  console.log(req.params.id);
  try {
    const id = req.params.id;
    const { companyName, industry, contact, location } = req.body;
    await pool.query(
      "UPDATE customers SET company_name = $1, industry = $2, contact = $3, location = $4 WHERE customer_id = $5",
      [companyName, industry, contact, location, id]);
    res.json({ success: true, message: `Customer ${id} has been updated` });
  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});

app.use(express.static("public"));
