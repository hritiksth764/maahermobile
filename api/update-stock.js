const AWS = require("aws-sdk");

// Initialize the S3 client
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "your-bucket-region", // e.g., "us-east-1"
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { cartItems } = req.body;

  try {
    // Fetch the existing stock.json from S3
    const stockData = await s3
      .getObject({
        Bucket: "your-bucket-name", // Your S3 bucket name
        Key: "stock.json", // The key for your stock file
      })
      .promise();

    let stock = JSON.parse(stockData.Body.toString());

    // Update the stock for each product
    cartItems.forEach((item) => {
      const product = stock.products.find((p) => p.name === item.name);
      if (product) {
        product.inStock = false; // Mark the product as out of stock
      }
    });

    // Upload the updated stock.json back to S3
    await s3
      .putObject({
        Bucket: "your-bucket-name", // Your S3 bucket name
        Key: "stock.json",
        Body: JSON.stringify(stock),
        ContentType: "application/json",
      })
      .promise();

    // Return success response
    return res.status(200).json({ message: "Stock updated successfully" });
  } catch (error) {
    console.error("Error updating stock:", error);
    return res.status(500).json({ message: "Failed to update stock" });
  }
}
