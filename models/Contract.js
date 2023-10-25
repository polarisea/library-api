const { model, Schema } = require("mongoose");
const UserModel = require("./User.model");
const BookModel = require("./Book.model");
const schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    books: [
      {
        _id: { type: Schema.Types.ObjectId, ref: "Book", required: true },
        name: { type: String, required: true },
        status: { type: Number, required: true },
        lateReturnFine: {
          type: Number,
          default: 0,
        },
        damagedBookFine: {
          type: Number,
          default: 0,
        },
      },
    ],
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
    violationCost: {
      type: Object,
      default: null,
    },
    returnBookStatus: {
      type: Object,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "contract" }
);

module.exports = model("Contract", schema);
