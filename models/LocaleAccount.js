const mongoose = require('mongoose');

var memberCollectionSchema = new mongoose.Schema({
  givenBy: {
    type: String,
    trim: true,
  },
  amount: {
    type: String,
    trim: true,
  },
});

var monthlyCollectionSchema = new mongoose.Schema({
  month: {
    type: String,
    trim: true,
  },
  collections: [memberCollectionSchema],
});


const schema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  monthly_collections: [monthlyCollectionSchema]
});

module.exports = mongoose.model('LocaleAccount', schema);