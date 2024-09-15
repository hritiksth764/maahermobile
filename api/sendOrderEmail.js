const nodemailer = require("nodemailer");

export default async (req, res) => {
  const { payment_id, contactDetails, cartItems } = req.body;

  // Create a transporter using Nodemailer
  const transporter = nodemailer.createTransport({
    service: "gmail", // or your email service
    auth: {
      user: "hritiksth764@gmail.com", // Replace with your email
      pass: "ssij lcuu fwjn vqir", // Replace with your password or app-specific password
    },
  });

  // Generate email content
  const mailOptions = {
    from: "hritiksth764@gmail.com", // Sender address
    to: "hritik.s@coreexperience.com", // Recipient email (shop owner)
    subject: "New Order Received",
    text: `
      Payment ID: ${payment_id}
      Customer: ${contactDetails.firstName} ${contactDetails.lastName}
      Email: ${contactDetails.email}
      Phone: ${contactDetails.phone}
      Address: ${contactDetails.address1}, ${contactDetails.address2}, ${
      contactDetails.city
    }, ${contactDetails.state}, ${contactDetails.pin}
      
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
