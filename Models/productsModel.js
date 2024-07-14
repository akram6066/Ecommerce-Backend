const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  images: { type: [String] },
  price: { type: Number, required: true },
  salePrice: { type: Number },
  salePriceDate: { type: Date },
  isTrending: { type: Boolean, default: false },
  units: { type: Number, default: 0 },
  catID: { type: Schema.Types.ObjectId, ref: 'Category', required: true }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
