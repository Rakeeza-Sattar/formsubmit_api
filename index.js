// Install dependencies: npm install express nodemailer cors dotenv
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Nodemailer Transporter Configuration
const transporter = nodemailer.createTransport({
  service: "gmail", // Use Gmail SMTP
  auth: {
    user: process.env.EMAIL, // Sender email (set in .env)
    pass: process.env.PASSWORD, // App Password (set in .env)
  },
});

// Test transporter configuration (optional, remove in production)
transporter.verify((error, success) => {
  if (error) {
    console.error("Error with transporter configuration:", error);
  } else {
    console.log("Mail server is ready to send messages.");
  }
});

// API Endpoint for sending emails
app.post("/send-email", async (req, res) => {
  const {
    firstName,
    lastName,
    companyName,
    phone,
    email,
    businessType,
    vehicleType,
    language,
  } = req.body;

  // Validate all required fields
  if (
    !firstName ||
    !lastName ||
    !companyName ||
    !phone ||
    !email ||
    !businessType ||
    !vehicleType ||
    !language
  ) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    // Email content
    const mailOptions = {
      from: process.env.EMAIL, // Sender email
      to: "rakeezasattar53@gmail.com", // Replace with admin email
      subject: "New Form Submission",
      text: `
        New form submission details:

        First Name: ${firstName}
        Last Name: ${lastName}
        Company Name: ${companyName}
        Phone: ${phone}
        Email: ${email}
        Business Type: ${businessType}
        Vehicle Type: ${vehicleType}
        Preferred Language: ${language}
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Success response
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email." });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
