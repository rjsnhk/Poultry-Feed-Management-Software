const mongoose = require("mongoose");

const SubscriptionSchema = new mongoose.Schema({
  employeeId: mongoose.Schema.Types.ObjectId,
  role: String,
  subscription: Object,
  browserId: String,
});

module.exports = mongoose.model("Subscription", SubscriptionSchema);
