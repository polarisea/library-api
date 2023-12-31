const { model, Schema } = require("mongoose");

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    authors: {
      type: [String],
      required: true,
    },
    publishers: {
      type: [String],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    categories: {
      type: [String],
      required: true,
    },
    cover: {
      type: String,
      default: null,
    },
    lateReturnFine: {
      type: Number,
      default: 0,
    },
    damagedBookFine: {
      type: Number,
      default: 0,
    },
    indexedContent: {
      type: String,
      require: true,
    },
    count: {
      type: Number,
      default: 0,
    },
    brokenCount: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "book" }
);

module.exports = model("Book", schema);
