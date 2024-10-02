const AWS = require("aws-sdk");
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "eu-north-1", // Ensure this matches your S3 bucket's region
});

module.exports = async (req, res) => {
  console.log("Event received:", JSON.stringify(req.body, null, 2));

  // Define allowed origins
  const allowedOrigins = ["https://www.maher.life", "https://maaher.life"];
  const origin = req.headers.origin;

  // Set CORS headers for allowed origins
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    res.setHeader("Access-Control-Allow-Origin", "https://www.maher.life"); // Fallback default origin
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { cartItems } = req.body;

    // Validate cartItems
    if (!cartItems || !Array.isArray(cartItems)) {
      console.error("Invalid cartItems:", cartItems);
      return res.status(400).json({ message: "Invalid cartItems" });
    }

    // Fetch the existing stock.json from S3
    const stockData = await s3
      .getObject({
        Bucket: "maaher-product-inventory", // Replace with your bucket name
        Key: "stock.json", // Replace with your JSON file's key in S3
      })
      .promise();

    // Parse the stock data
    let stock = JSON.parse(stockData.Body.toString());

    // Update the stock for each product in cartItems
    cartItems.forEach((item) => {
      const product = stock.products.find((p) => p.name === item.name);
      if (product) {
        product.inStock = false; // Mark product as out of stock
      }
    });

    // Upload the updated stock.json back to S3
    await s3
      .putObject({
        Bucket: "maaher-product-inventory", // Replace with your bucket name
        Key: "stock.json", // Replace with your stock JSON file key
        Body: JSON.stringify(stock),
        ContentType: "application/json",
      })
      .promise();

    // Send a success response
    return res.status(200).json({ message: "Stock updated successfully" });
  } catch (error) {
    console.error("Error updating stock:", error);
    return res
      .status(500)
      .json({ message: error.message || "Failed to update stock" });
  }
};
