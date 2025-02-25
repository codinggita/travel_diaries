import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import fetch from "node-fetch";
import admin from "firebase-admin";

// Load environment variables
dotenv.config();

// Validate Firebase environment variables
if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_PRIVATE_KEY || !process.env.FIREBASE_CLIENT_EMAIL) {
  console.error("Missing Firebase environment variables");
  process.exit(1);
}

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }),
});

// Initialize MongoDB connection
const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
    process.exit(1);
  }
};

// Configure multer for multiple file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Define models
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  authMethod: { type: String, default: "local" },
  createdAt: { type: Date, default: Date.now },
});
const User = mongoose.model("User", userSchema);

const journalSchema = new mongoose.Schema({
  journalId: { type: String, unique: true, default: uuidv4 },
  title: { type: String, required: true },
  content: { type: String, required: true }, // Structured JSON containing chapters
  username: { type: String, required: true, index: true },
  createdAt: { type: Date, default: Date.now },
  images: [{ type: String }], // Array for chapter images
  coverImage: { type: String, default: "https://via.placeholder.com/150x200?text=Default+Cover" },
  countries: [{ type: String }],
  startDate: { type: Date, default: null },
  endDate: { type: Date, default: null },
});
const Journal = mongoose.model("Journal", journalSchema);

const countrySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // Ensure id is unique and required
  hero: {
    title: { type: String, required: true },
    description: { type: String, required: true },
    buttonText: String,
    image: { type: String, required: true },
  },
  discover: {
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  infoCards: [
    {
      title: { type: String, required: true },
      icon: { type: String, required: true },
      description: { type: String, required: true },
    },
  ],
  activities: [
    {
      image: { type: String, required: true },
      title: { type: String, required: true },
      description: { type: String, required: true },
    },
  ],
});
const Country = mongoose.model("Country", countrySchema);

// Authentication Middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Expecting "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: "Authentication token required" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // Attach decoded user info to request
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(403).json({ error: "Invalid or expired token" });
  }
};

// Define all routes in a single function
const allRoutes = (app) => {
  // Proxy Routes (Port 5000)
  app.get("/proxy", async (req, res) => {
    const targetURL = req.query.url;
    if (!targetURL) return res.status(400).json({ error: "URL is required" });

    try {
      const response = await fetch(targetURL);
      if (!response.ok) throw new Error("Failed to fetch target URL");
      const data = await response.text();
      res.send(data);
    } catch (error) {
      res.status(500).json({ error: `Error fetching the URL: ${error.message}` });
    }
  });

  // User Routes (Port 5001)
  app.post("/api/register", async (req, res) => {
    try {
      const { username, email, password, authMethod } = req.body;
      if (!username || !email || !password) {
        return res.status(400).json({ error: "Username, email, and password are required" });
      }
      const user = new User({ username, email, password, authMethod });
      await user.save();
      res.status(201).json({ message: "User registered successfully", user: { username, email } });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Journal Routes (Port 5002)
  app.post("/api/journals", authenticateToken, upload.fields([{ name: "coverImage", maxCount: 1 }, { name: "images" }]), async (req, res) => {
    try {
      const { title, content, countries, startDate, endDate } = req.body;
      const username = req.user.email;

      if (!title || !content) {
        return res.status(400).json({ error: "Title and content are required" });
      }

      const parsedContent = JSON.parse(content);
      if (!parsedContent.chapters || !Array.isArray(parsedContent.chapters)) {
        return res.status(400).json({ error: "Content must contain a chapters array" });
      }

      let coverImage = "https://via.placeholder.com/150x200?text=Default+Cover";
      if (req.files && req.files["coverImage"] && req.files["coverImage"][0]) {
        const coverFile = req.files["coverImage"][0];
        coverImage = `data:${coverFile.mimetype};base64,${coverFile.buffer.toString("base64")}`;
      }

      const chapterImages = req.files && req.files["images"]
        ? req.files["images"].map(file => `data:${file.mimetype};base64,${file.buffer.toString("base64")}`)
        : [];

      let imageIndex = 0;
      parsedContent.chapters.forEach(chapter => {
        const numImages = chapter.images ? chapter.images.length : 0;
        chapter.images = chapterImages.slice(imageIndex, imageIndex + numImages);
        imageIndex += numImages;
      });

      const journal = new Journal({
        title,
        content: JSON.stringify(parsedContent),
        username,
        images: chapterImages,
        coverImage,
        countries: countries ? JSON.parse(countries) : [],
        startDate: startDate || null,
        endDate: endDate || null,
      });

      await journal.save();
      res.status(201).json({ message: "Journal created successfully", journal });
    } catch (error) {
      console.error("Error creating journal:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/journals", authenticateToken, async (req, res) => {
    try {
      const username = req.user.email;
      const journals = await Journal.find({ username });
      res.status(200).json(journals);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/journals/:journalId", authenticateToken, async (req, res) => {
    try {
      const { journalId } = req.params;
      const username = req.user.email;
      const journal = await Journal.findOne({ journalId, username });
      if (!journal) {
        return res.status(404).json({ error: "Journal not found or you don’t have access" });
      }
      res.status(200).json(journal);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/journals/:journalId", authenticateToken, upload.fields([{ name: "coverImage", maxCount: 1 }, { name: "images" }]), async (req, res) => {
    try {
      const { journalId } = req.params;
      const { title, content } = req.body;
      const username = req.user.email;

      if (!title || !content) {
        return res.status(400).json({ error: "Title and content are required" });
      }

      const parsedContent = JSON.parse(content);
      if (!parsedContent.chapters || !Array.isArray(parsedContent.chapters)) {
        return res.status(400).json({ error: "Content must contain a chapters array" });
      }

      let coverImage;
      if (req.files && req.files["coverImage"] && req.files["coverImage"][0]) {
        const coverFile = req.files["coverImage"][0];
        coverImage = `data:${coverFile.mimetype};base64,${coverFile.buffer.toString("base64")}`;
      }

      const chapterImages = req.files && req.files["images"]
        ? req.files["images"].map(file => `data:${file.mimetype};base64,${file.buffer.toString("base64")}`)
        : [];
      let imageIndex = 0;
      parsedContent.chapters.forEach((chapter) => {
        const chapterImageCount = chapter.images ? chapter.images.length : 0;
        chapter.images = chapterImages.slice(imageIndex, imageIndex + chapterImageCount);
        imageIndex += chapterImageCount;
      });

      const updates = { 
        title, 
        content: JSON.stringify(parsedContent), 
        images: chapterImages,
      };
      if (coverImage) updates.coverImage = coverImage;

      const updatedJournal = await Journal.findOneAndUpdate(
        { journalId, username },
        updates,
        { new: true }
      );

      if (!updatedJournal) {
        return res.status(404).json({ error: "Journal not found or you don’t have access" });
      }
      res.status(200).json({ message: "Journal updated successfully", updatedJournal });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/journals/:journalId", authenticateToken, async (req, res) => {
    try {
      const { journalId } = req.params;
      const username = req.user.email;
      const deletedJournal = await Journal.findOneAndDelete({ journalId, username });
      if (!deletedJournal) {
        return res.status(404).json({ error: "Journal not found or you don’t have access" });
      }
      res.status(200).json({ message: "Journal deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Country Routes (Port 3000)
  app.get("/api/countries", async (req, res) => {
    try {
      const data = await Country.find();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/countries/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const country = await Country.findOne({ id });
      if (!country) {
        return res.status(404).json({ message: "Country not found" });
      }
      res.status(200).json(country);
    } catch (error) {
      res.status(500).json({ error: "Error fetching country: " + error.message });
    }
  });

  app.post("/api/countries", async (req, res) => {
    try {
      const newData = new Country(req.body);
      await newData.save();
      res.status(201).json({ message: "New country data added successfully", data: newData });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/countries/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const updatedData = await Country.findOneAndUpdate({ id }, updates, { new: true });
      if (!updatedData) {
        return res.status(404).json({ message: "Country not found" });
      }
      res.status(200).json({ message: "Country data updated successfully", data: updatedData });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/countries/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deletedData = await Country.findOneAndDelete({ id });
      if (!deletedData) {
        return res.status(404).json({ message: "Country not found" });
      }
      res.status(200).json({ message: "Country data deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};

// Function to create and start a server
const createServer = (port, routesConfig) => {
  const app = express();
  app.use(express.json());
  app.use(cors());

  // Apply routes
  routesConfig(app);

  return new Promise((resolve, reject) => {
    const server = app.listen(port, "0.0.0.0", () => {
      console.log(`Server running on port ${port}`);
      resolve(server);
    });
    server.on("error", (err) => {
      console.error(`Server error on port ${port}:`, err);
      reject(err);
    });
  });
};

// Start all servers with a single message
const startServers = async () => {
  await connectMongoDB();

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