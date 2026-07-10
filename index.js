import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import app from "./src/app.js";
// For development only
dotenv.config();

connectDB();

const PORT = process.env.PORT || 5000;

// server start

app.listen(PORT, () => {
  console.log(`Server start on the PORT ${PORT}`);
});

//http://localhost:5000
