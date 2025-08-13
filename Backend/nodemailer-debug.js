// nodemailer-debug.js
require("dotenv").config();

console.log("=== NODEMAILER DEBUG ===");

try {
  const nodemailer = require('nodemailer');
  console.log("Nodemailer imported successfully");
  console.log("Nodemailer object:", Object.keys(nodemailer));
  console.log("Has createTransporter?", typeof nodemailer.createTransporter);
  
  if (typeof nodemailer.createTransporter === 'function') {
    console.log("✅ createTransporter is available");
    
    // Try to create transporter
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    console.log("✅ Transporter created successfully");
    
  } else {
    console.log("❌ createTransporter is not a function");
    console.log("Available methods:", Object.keys(nodemailer));
  }
  
} catch (error) {
  console.log("❌ Error importing nodemailer:", error.message);
}