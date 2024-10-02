const AWS = require("aws-sdk");
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "eu-north-1", // Correct region for your S3 bucket
});

exports.handler = async function (event) {
  try {
    const { cartItems } = JSON.parse(event.body);

    // Check if cartItems is defined and is an array
    if (!cartItems || !Array.isArray(cartItems)) {
      throw new Error("Invalid cartItems");
    }

    // Fetch the existing stock.json from S3
    const stockData = await s3
      .getObject({
        Bucket: "maaher-product-inventory", // Replace with your bucket name
        Key: "stock.json", // Ensure this matches your JSON file's key in S3
      })
      .promise();

    let stock = JSON.parse(stockData.Body.toString());

    // Update the stock for each product
    cartItems.forEach((item) => {
      const product = stock.products.find((p) => p.name === item.name);
      if (product) {
        product.inStock = false; // Set the product as out of stock
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

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Stock updated successfully" }),
    };
  } catch (error) {
    console.error("Error updating stock:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: error.message || "Failed to update stock",
      }),
    };
  }
};
