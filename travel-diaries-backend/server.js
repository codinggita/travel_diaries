const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/v1/auth", require("./routes/authRoutes"));
app.use("/api/v1/journals", require("./routes/journalRoutes"));

app.get("/", (req, res) => res.send("Travel Diaries API is running."));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
