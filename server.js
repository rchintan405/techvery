const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("."));

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "princeshiloja3s@gmail.com",
    pass: "peswyriwxvbyazuw"
  }
});

app.post("/api/send-email", async (req, res) => {
  try {
    const data = req.body;
    let fieldsHtml = "";
    for (const [key, value] of Object.entries(data)) {
      if (key !== "access_key" && key !== "botcheck" && key !== "email_to" && key !== "subject") {
        fieldsHtml += `<p style="margin: 8px 0;"><strong>${key}:</strong> ${value}</p>`;
      }
    }

    const recipient = data.email_to || "utsav8746@gmail.com";

    const mailOptions = {
      from: `"TECHVERY Website" <princeshiloja3s@gmail.com>`,
      to: recipient,
      subject: "Techvery Form",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px; color: #111; max-width: 600px; margin: 0 auto; border: 1px solid #e5e5e5; border-radius: 8px;">
          <h3 style="color: #FF5812; margin-top: 0;">Techvery Form</h3>
          
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <div style="background-color: #f9f9f9; padding: 16px; border-radius: 6px;">
            ${fieldsHtml}
          </div>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #999; margin-bottom: 0;">Sent directly from princeshiloja3s@gmail.com</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email successfully sent from princeshiloja3s@gmail.com to ${recipient}`);
    res.json({ success: true, message: `Email sent from princeshiloja3s@gmail.com to ${recipient}` });
  } catch (err) {
    console.error("Nodemailer SMTP Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`TECHVERY Direct Gmail SMTP Server running at http://localhost:${PORT}`);
});
