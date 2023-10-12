const { model, Schema } = require("mongoose");
const AuthorModel = require("./Author.model");
const CategoryModel = require("./Category.model");

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    authors: [
      {
        type: Schema.Types.ObjectId,
        ref: "Author",
      },
    ],
    description: {
      type: String,
      required: true,
    },
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    count: {
      type: Number,
      default: 0,
    },
    cover: {
      type: String,
      default: null,
    },
    contracts: {
      type: Number,
      default: 0,
    },
    votes: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "book" },
);

module.exports = model("Book", schema);
