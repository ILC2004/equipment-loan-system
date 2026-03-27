const bcrypt = require("bcryptjs");

const run = async () => {
  const adminHash = await bcrypt.hash("admin123", 10);
  const studentHash = await bcrypt.hash("student123", 10);
  const staffHash = await bcrypt.hash("staff123", 10);

  console.log("Admin hash:", adminHash);
  console.log("Student hash:", studentHash);
  console.log("Staff hash:", staffHash);
};

run();