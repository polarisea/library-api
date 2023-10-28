const { model, Schema } = require("mongoose");
const UserModel = require("./User.model");
const BookModel = require("./Book.model");
const schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    book: {
      type: Schema.Types.ObjectId,
      ref: "Book",
    },
    from: {
      type: Date,
      required: true,
    },
    to: {
      type: Date,
      required: true,
    },
    status: {
      type: Number,
      default: 0,
    },
    returnDate: {
      type: Date,
      default: null,
    },
    isFinePaid: {
      type: Boolean,
      default: false,
    },
    returnBookStatus: {
      type: Number,
      default: 0,
    },
    indexedContent: {
      type: String,
      require: true,
    },
    violationCost: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "contract" }
);

module.exports = model("Contract", schema);
