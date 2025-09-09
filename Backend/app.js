require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const userController = require("./controllers/user.controller");
const matchController = require("./controllers/match.controller");
const adminController = require("./controllers/admin.controller");
const { sendTestEmailSuite } = require("./services/emailService");

// ! Connecting to the Database
mongoose.connect(process.env.MONGO_URI);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error"));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// (express.json()) will allows us to send a payload or request object to our server, and our routes will be able to parse it.
app.use(express.json());

// FIXED CORS CONFIGURATION
const corsOptions = {
  origin: [
    'https://bennrisinglive.vercel.app',  // REMOVED trailing slash
    'http://localhost:5173',              // Local development
    'http://localhost:3000',              // Alternative local port
    'https://bennrisinglive.vercel.app/', // Keep this as backup (with slash)
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin'
  ]
};

// Apply CORS middleware BEFORE other routes
app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

//  *** TODO Controller Routes BELOW ***
app.use("/user", userController);
app.use("/match", matchController);
app.use("/admin", adminController);

// Use PORT from environment variable (Render provides this) or fallback to 4000
const PORT = process.env.PORT || 4000;
// For production (Render), always use 0.0.0.0 to accept connections from any IP
const HOST = "0.0.0.0";

const uploadURL = require("./s3");

app.use(express.static("Static"));

// Basic health check endpoint
app.get("/", (req, res) => {
  res.status(200).json({ 
    message: "Bennington Rising Backend API is running!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    corsOrigins: corsOptions.origin  // Debug info
  });
});

// !Get image endpoint needed for s3 upload
app.get("/geturl", async (req, res) => {
  try {
    const url = await uploadURL();
    res.status(200).json(url);
  } catch (error) {
    console.error("Error generating upload URL:", error);
    res.status(500).json({ message: "Failed to generate image upload URL" });
  }
});

// Test endpoint for emails (only available in development)
if (process.env.NODE_ENV !== "production") {
  app.get("/test/emails", async (req, res) => {
    try {
      if (process.env.EMAIL_TEST_MODE !== "true") {
        return res.status(400).json({
          message:
            "Email test mode is not enabled. Set EMAIL_TEST_MODE=true in .env",
        });
      }

      console.log("Running email test suite...");
      const results = await sendTestEmailSuite();

      res.status(200).json({
        message: "Test emails sent successfully",
        testEmail: process.env.TEST_EMAIL_ADDRESS,
        results: results,
      });
    } catch (error) {
      console.error("Error sending test emails:", error);
      res.status(500).json({
        message: "Error sending test emails",
        error: error.message,
      });
    }
  });
}

app.listen(PORT, HOST, () => {
  console.log(`Server is running on port: ${PORT}, listening on ${HOST}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`CORS configured for origins:`, corsOptions.origin);
});