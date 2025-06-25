// const mongoose = require("mongoose");

// const ShareSchema = new mongoose.Schema({
//   token: String,
//   senderId: String,
//   data: Object,
//   recipientPhone: String,
//   accessedAt: Date,
//   createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model("Share", ShareSchema);
const mongoose = require("mongoose");

const shareSchema = new mongoose.Schema({
  shareId: String,
  selectedData: Object,
  pin: String,
  createdAt: { type: Date, default: Date.now, expires: '10m' }, // expires in 10 minutes
});

module.exports = mongoose.model("Share", shareSchema);
