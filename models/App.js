const mongoose = require("mongoose");

const appSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  details: String,
  apk: { type: String, required: true },
  screenshot: String,
  downloads: { type: Number, default: 0 },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const App = mongoose.model("App", appSchema);
module.exports = mongoose.model("App", appSchema);
