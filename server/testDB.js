const mysql = require("mysql2/promise");

async function testDB() {
  try {
    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "equipment_loan_db"
    });

    console.log("Database connected successfully");
    await db.end();
  } catch (err) {
    console.error("Database connection failed:", err);
  }
}

testDB();