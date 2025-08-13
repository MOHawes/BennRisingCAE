// debug-email.js - Save this in your backend root directory
require("dotenv").config();

console.log("=== EMAIL DEBUG TEST ===");
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "SET (16 chars)" : "NOT SET");

const testEmailDirectly = async () => {
  try {
    console.log("\n1. Testing email service import...");
    const { sendWelcomeEmail } = require("./services/emailService");
    console.log("✅ Email service imported successfully");
    
    console.log("\n2. Testing direct email send...");
    const result = await sendWelcomeEmail("nickr967@gmail.com", "Debug Test User");
    
    console.log("Result:", result);
    
    if (result.success) {
      console.log("✅ EMAIL SENT SUCCESSFULLY! Check nickr967@gmail.com");
    } else {
      console.log("❌ Email failed:", result.error);
    }
    
  } catch (error) {
    console.log("❌ Error:", error.message);
    console.log("Stack:", error.stack);
  }
};

testEmailDirectly();