const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "equipment_loan_db"
});

exports.getAllEquipment = async (req, res) => {
  try {
    const { search = "", category = "" } = req.query;

    let sql = "SELECT * FROM equipment WHERE 1=1";
    const params = [];

    if (search) {
      sql += " AND (name LIKE ? OR serial_number LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    if (category) {
      sql += " AND category = ?";
      params.push(category);
    }

    sql += " ORDER BY id DESC";

    const [rows] = await db.execute(sql, params);
    res.json(rows);
  } catch (err) {
    console.error("GET EQUIPMENT ERROR:", err);
    res.status(500).json({ message: "Failed to fetch equipment" });
  }
};

exports.addEquipment = async (req, res) => {
  try {
    const { name, category, serial_number, status } = req.body;

    if (!name || !category) {
      return res.status(400).json({ message: "Name and category are required" });
    }

    if (serial_number) {
      const [existing] = await db.execute(
        "SELECT id FROM equipment WHERE serial_number = ?",
        [serial_number]
      );

      if (existing.length > 0) {
        return res.status(400).json({ message: "Serial number already exists" });
      }
    }

    await db.execute(
      "INSERT INTO equipment (name, category, serial_number, status) VALUES (?, ?, ?, ?)",
      [name.trim(), category.trim(), serial_number?.trim() || null, status || "available"]
    );

    res.status(201).json({ message: "Equipment added successfully" });
  } catch (err) {
    console.error("ADD EQUIPMENT ERROR:", err);
    res.status(500).json({ message: "Failed to add equipment" });
  }
};

exports.updateEquipment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, serial_number, status } = req.body;

    if (!name || !category || !status) {
      return res.status(400).json({ message: "Name, category and status are required" });
    }

    if (serial_number) {
      const [existing] = await db.execute(
        "SELECT id FROM equipment WHERE serial_number = ? AND id <> ?",
        [serial_number, id]
      );

      if (existing.length > 0) {
        return res.status(400).json({ message: "Serial number already exists" });
      }
    }

    const [result] = await db.execute(
      `UPDATE equipment
       SET name = ?, category = ?, serial_number = ?, status = ?
       WHERE id = ?`,
      [name.trim(), category.trim(), serial_number?.trim() || null, status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Equipment not found" });
    }

    res.json({ message: "Equipment updated successfully" });
  } catch (err) {
    console.error("UPDATE EQUIPMENT ERROR:", err);
    res.status(500).json({ message: "Failed to update equipment" });
  }
};