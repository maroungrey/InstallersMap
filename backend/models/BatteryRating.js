const mongoose = require('mongoose');

const BatteryRatingSchema = new mongoose.Schema({
  batteryId: { type: String, required: true }, // ID from SQL database
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BatteryRating', BatteryRatingSchema);

// models/CompanyRating.js
const mongoose = require('mongoose');

const CompanyRatingSchema = new mongoose.Schema({
  companyId: { type: String, required: true }, // ID from SQL database
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CompanyRating', CompanyRatingSchema);