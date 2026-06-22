const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const Order = require("../models/Order");

// @desc    Verify Khalti payment and mark order as paid
// @route   POST /api/payment/khalti/verify
// @access  Private
// NOTE: Requires KHALTI_SECRET_KEY in .env. Uses Khalti's lookup API.
const verifyKhaltiPayment = asyncHandler(async (req, res) => {
  const { token, orderId, amount } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  // Call Khalti's verification endpoint
  const response = await fetch("https://khalti.com/api/v2/payment/verify/", {
    method: "POST",
    headers: {
      Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token, amount }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(400, "Khalti payment verification failed");
  }

  order.isPaid = true;
  order.paymentResult = {
    id: data.idx,
    status: "completed",
    transactionId: data.idx,
    paidAt: new Date(),
  };
  await order.save();

  res.json({ success: true, message: "Payment verified", order });
});

// @desc    Verify eSewa payment and mark order as paid
// @route   POST /api/payment/esewa/verify
// @access  Private
// NOTE: Uses eSewa's transaction status check API.
const verifyEsewaPayment = asyncHandler(async (req, res) => {
  const { orderId, transactionUuid, totalAmount } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  const merchantCode = process.env.ESEWA_MERCHANT_CODE;
  const url = `https://rc.esewa.com.np/api/epay/transaction/status/?product_code=${merchantCode}&total_amount=${totalAmount}&transaction_uuid=${transactionUuid}`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.status !== "COMPLETE") {
    throw new ApiError(400, "eSewa payment not completed");
  }

  order.isPaid = true;
  order.paymentResult = {
    id: transactionUuid,
    status: "completed",
    transactionId: data.ref_id,
    paidAt: new Date(),
  };
  await order.save();

  res.json({ success: true, message: "Payment verified", order });
});

module.exports = { verifyKhaltiPayment, verifyEsewaPayment };
