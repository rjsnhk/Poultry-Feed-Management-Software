const mongoose = require('mongoose');

//party Schema
const partySchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  contactPersonNumber: { type: String, required: true },
  address: { type: String, required: true },
});

const OrderSchema = new mongoose.Schema({
  // Order details
  productType: { type: String, required: true },
  item: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  totalAmount: { type: Number, required: true },
  advanceAmount: { type: Number, default: 0 },
  dueAmount: { type: Number },
  dueDate: { type: Date },
  paymentMode: { type: String, enum: ['UPI', 'Cash', 'Bank Transfer'] },
  notes: { type: String },

  // Status & Tracking
  orderStatus: {
    type: String,
    enum: [
      'Placed', 'ForwardedToAuthorizer',
      'WarehouseAssigned', 'Approved', 'Dispatched',
      'Delivered', 'Cancelled'
    ],
    default: 'Placed'
  },
  paymentStatus: {
    type: String,
    enum: ['Unpaid', 'Partial', 'Paid'],
    default: 'Unpaid'
  },
  invoiceGenerated: { type: Boolean, default: false },
  salesmanReceived: { type: Boolean, default: false },

  // Relational Mapping (Steps)
  placedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Salesman', required: true },
 forwardedByManager: { type: mongoose.Schema.Types.ObjectId, ref: 'SalesManager' },
  forwardedByAuthorizer: { type: mongoose.Schema.Types.ObjectId, ref: 'SalesAuthorizer' },
  assignedWarehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  invoicedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Accountant' },
  paymentCollectedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Salesman' },

  dispatchInfo: {
  dispatchedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'PlantHead' },
  dispatchDate: Date,
  vehicleNumber: String,
  driverName: String,
  driverContact: String,
  transportCompany: String,
},

// OrderSchema.js (add inside OrderSchema)
canceledBy: {
  role: { type: String, enum: ['Admin', 'SalesManager', 'SalesAuthorizer', 'PlantHead'], default: null },
  user: { type: mongoose.Schema.Types.ObjectId, refPath: 'canceledBy.role' },
  reason: String,
  date: Date
},

  
  // Party Info
  party: {
    type: partySchema,
    required: true
  },



  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
