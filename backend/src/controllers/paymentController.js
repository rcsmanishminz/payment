const razorpay = require("../utils/razorpay");

const handlePayment = async (req, res, next) => {
  try {
    const amountInPaise = 100000; // ₹100 in paise
    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: generateReceipt(),
      payment_capture: 0, // Auto-capture is disabled
    };

    // Step 1: Create the order
    const order = await razorpay.orders.create(options);

    // Step 2: Open Razorpay popup on the client side
    res.json({ order, amountInPaise, currency: "INR" });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error. Unable to create the order." });
  }
};

// Function to generate a dynamic receipt
const generateReceipt = () => {
  const prefix = "RCPT";
  const randomComponent = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  const timestamp = new Date()
    .toISOString()
    .replace(/[-:]/g, "")
    .replace("T", "")
    .replace(/\.\d{3}Z/, "");

  return `${prefix}-${timestamp}-${randomComponent}`;
};
//only works in production
const verifyPayment = async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;

    // Verify the payment signature
    const isValidSignature = razorpay.webhooks.verifyPaymentSignature(
      JSON.stringify(req.body),
      signature,
      "WEBHOOK" //webhook goes here
    );

    if (!isValidSignature) {
      return res.status(400).json({ error: "Invalid signature" });
    }

    // Capture the payment
    const paymentCaptureResponse = await razorpay.payments.capture(paymentId);

    // Process paymentCaptureResponse
    const paymentDetails = {
      orderId,
      paymentId,
      amount: paymentCaptureResponse.amount,
      currency: paymentCaptureResponse.currency,
    };

    console.log("Payment Details:", paymentDetails);

    res.json({ message: "Payment verification successful", paymentDetails });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { handlePayment, verifyPayment };
