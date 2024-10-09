const nodemailer = require("nodemailer");

export default async (req, res) => {
  const { payment_id, userInfo, cartItems } = req.body; // Change contactDetails to userInfo

  // Create a transporter using Nodemailer
  const transporter = nodemailer.createTransport({
    service: "smtp.secureserver.net",
    port: 465,
    secure: true, // or your email service
    auth: {
      user: "hello@maaher.co.in", // Replace with your email
      pass: "Anahita861!", // Replace with your password or app-specific password
    },
  });

  // Generate email content
  const mailOptions = {
    from: "hello@maaher.co.in", // Sender address
    to: "hello@maaher.co.in", // Recipient email (shop owner)
    subject: "New Order Received",
    text: `
      Payment ID: ${payment_id}
      Customer: ${userInfo.firstName} ${userInfo.lastName}
      Email: ${userInfo.email}
      Phone: ${userInfo.phone}
      Address: ${userInfo.address1}, ${userInfo.address2 || ""}, ${
      userInfo.city
    }, ${userInfo.state}, ${userInfo.pin}
      
      Order Details:
      ${cartItems
        .map((item) => `${item.name} - Rs. ${item.price} x ${item.quantity}`)
        .join("\n")}
    `,
  };

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Order email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send email" });
  }
};
