const mongoose = require('mongoose');
const plantHeadSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: String,
  role: { type: String, default: 'PlantHead' },
}, { timestamps: true });

module.exports = mongoose.model('PlantHead', plantHeadSchema);
  