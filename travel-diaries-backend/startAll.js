import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import fetch from "node-fetch";

// Load environment variables
dotenv.config();

// Initialize MongoDB connection
const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (err) {
    console.log("MongoDB Connection Error:", err);
    process.exit(1);
  }
};

// Configure multer for file uploads (for Journals)
const upload = multer({ storage: multer.memoryStorage() });

// Define models
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  authMethod: String,
  createdAt: { type: Date, default: Date.now },
});
const User = mongoose.model("User", userSchema);

const journalSchema = new mongoose.Schema({
  journalId: { type: String, unique: true, default: uuidv4 },
  title: String,
  content: String,
  username: String,
  createdAt: { type: Date, default: Date.now },
  images: [String], // For journal cover images
});
const Journal = mongoose.model("Journal", journalSchema);

const countrySchema = new mongoose.Schema({
  id: String,
  hero: {
    title: String,
    description: String,
    buttonText: String,
    image: String,
  },
  discover: {
    title: String,
    description: String,
  },
  infoCards: [
    {
      title: String,
      icon: String,
      description: String,
    },
  ],
  activities: [
    {
      image: String,
      title: String,
      description: String,
    },
  ],
});
const Country = mongoose.model("Country", countrySchema);

// Function to create and start a server
const createServer = (port, routesConfig) => {
  const app = express();
  app.use(express.json());
  app.use(cors());

  // Apply routes
  routesConfig(app);

  return new Promise((resolve, reject) => {
    const server = app.listen(port, "0.0.0.0", () => {
      resolve(server);
    });
    server.on("error", (err) => {
      console.error(`Server error on port ${port}:`, err);
      reject(err);
    });
  });
};

// Define all routes in a single function
const allRoutes = (app) => {
  // Proxy Routes (Port 5000)
  app.get("/proxy", async (req, res) => {
    const targetURL = req.query.url;
    if (!targetURL) return res.status(400).send("URL is required");

    try {
      const response = await fetch(targetURL);
      const data = await response.text();
      res.send(data);
    } catch (error) {
      res.status(500).send(`Error fetching the URL: ${error.message}`);
    }
  });

  // User Routes (Port 5001)
  app.post("/api/register", async (req, res) => {
    try {
      const { username, email, password, authMethod } = req.body;
      const user = new User({ username, email, password, authMethod });
      await user.save();
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Journal Routes (Port 5002)
  app.post("/api/journals", upload.single("coverImage"), async (req, res) => {
    try {
      const { title, content, username, chapterName, date, story } = req.body;

      if (!title || !content || !username) {
        return res
          .status(400)
          .json({ error: "Title, content, and username are required" });
      }

      let images = [];
      if (req.file) {
        const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString(
          "base64"
        )}`;
        images.push(base64Image);
      } else {
        images.push("https://via.placeholder.com/150x200?text=Default+Cover");
      }

      const structuredContent = JSON.stringify({
        chapterName: chapterName || "",
        date: date || "",
        story: story || content || "",
      });

      const journal = new Journal({
        title,
        content: structuredContent,
        username,
        images,
      });
      await journal.save();

      res
        .status(201)
        .json({ message: "Journal created successfully", journal });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/journals", async (req, res) => {
    try {
      const journals = await Journal.find();
      res.status(200).json(journals);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/journals/:journalId", async (req, res) => {
    try {
      const { journalId } = req.params;
      const journal = await Journal.findOne({ journalId });

      if (!journal) {
        return res.status(404).json({ error: "Journal not found" });
      }

      res.status(200).json(journal);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/journals/user/:username", async (req, res) => {
    try {
      const { username } = req.params;
      const journals = await Journal.find({ username });

      if (!journals.length) {
        return res.status(404).json({ error: "No journals found for this username" });
      }

      res.status(200).json(journals);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/journals/:journalId", upload.single("coverImage"), async (req, res) => {
    try {
      const { journalId } = req.params;
      const { title, content, chapterName, date, story } = req.body;

      if (!title || !content) {
        return res.status(400).json({ error: "Title and content are required" });
      }

      let updates = { title, content: JSON.stringify(JSON.parse(content || '{}')) };
      if (req.file) {
        const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString(
          "base64"
        )}`;
        updates.images = [base64Image];
      }

      if (chapterName || date || story) {
        updates.content = JSON.stringify({
          chapterName: chapterName || "",
          date: date || "",
          story: story || content || "",
        });
      }

      const updatedJournal = await Journal.findOneAndUpdate(
        { journalId },
        updates,
        { new: true }
      );

      if (!updatedJournal) {
        return res.status(404).json({ error: "Journal not found" });
      }

      res
        .status(200)
        .json({ message: "Journal updated successfully", updatedJournal });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/journals/:journalId", async (req, res) => {
    try {
      const { journalId } = req.params;

      const deletedJournal = await Journal.findOneAndDelete({ journalId });

      if (!deletedJournal) {
        return res.status(404).json({ error: "Journal not found" });
      }

      res.status(200).json({ message: "Journal deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Country Routes (Port 3000)
  app.get("/api/countries", async (req, res) => {
    const data = await Country.find();
    res.json(data);
  });

  app.post("/api/countries", async (req, res) => {
    const newData = new Country(req.body);
    await newData.save();
    res
      .status(201)
      .json({ message: "New country data added successfully", data: newData });
  });

  app.patch("/api/countries/:id", async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const updatedData = await Country.findOneAndUpdate({ id }, updates, { new: true });
    if (!updatedData) {
      return res.status(404).json({ message: "Data not found" });
    }
    res.json({ message: "Country data updated successfully", data: updatedData });
  });

  app.delete("/api/countries/:id", async (req, res) => {
    const { id } = req.params;
    const deletedData = await Country.findOneAndDelete({ id });
    if (!deletedData) {
      return res.status(404).json({ message: "Data not found" });
    }
    res.json({ message: "Country data deleted successfully" });
  });
};

// Start all servers with a single message
const startServers = async () => {
  await connectMongoDB(); // Ensure MongoDB is connected

  const servers = [
    createServer(5000, allRoutes), // Proxy server
    createServer(5001, allRoutes), // User server
    createServer(5002, allRoutes), // Journal server
    createServer(3000, allRoutes), // Country server
  ];

  try {
    await Promise.all(servers);
    console.log("All servers started successfully on ports 3000, 5000, 5001, and 5002");
  } catch (err) {
    console.error("Error starting servers:", err);
    process.exit(1);
  }
};

startServers();