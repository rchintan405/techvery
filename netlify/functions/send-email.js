const nodemailer = require("nodemailer");

exports.handler = async function (event, context) {
  // Allow CORS
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, message: "Method Not Allowed" })
    };
  }

  try {
    let data = {};
    if (event.headers["content-type"] && event.headers["content-type"].includes("application/json")) {
      data = JSON.parse(event.body);
    } else {
      const querystring = require("querystring");
      data = querystring.parse(event.body);
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "princeshiloja3s@gmail.com",
        pass: "peswyriwxvbyazuw"
      }
    });

    let fieldsHtml = "";
    for (const [key, value] of Object.entries(data)) {
      if (key !== "access_key" && key !== "botcheck" && key !== "email_to" && key !== "subject") {
        fieldsHtml += `<p style="margin: 8px 0;"><strong>${key}:</strong> ${value}</p>`;
      }
    }

    const mailOptions = {
      from: `"TECHVERY Website" <princeshiloja3s@gmail.com>`,
      to: data.email_to || "utsav8746@gmail.com, aliah@techvery.com",
      subject: "Techvery Form",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px; color: #111; max-width: 600px; margin: 0 auto; border: 1px solid #e5e5e5; border-radius: 8px;">
          <h3 style="color: #FF5812; margin-top: 0;">TEchvery Form</h3>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <div style="background-color: #f9f9f9; padding: 16px; border-radius: 6px;">
            ${fieldsHtml}
          </div>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #999; margin-bottom: 0;">Sent automatically from techvery-kretoss.netlify.app</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, message: "Email sent successfully to aliah@techvery.com" })
    };
  } catch (error) {
    console.error("Nodemailer Error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};
