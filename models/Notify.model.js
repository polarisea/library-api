const { model, Schema } = require("mongoose");
const UserModel = require("./User.model");
const schema = new Schema(
  {
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    title: {
      type: String,
      require: true,
    },
    content: {
      type: String,
      require: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "notify" }
);

module.exports = model("Notify", schema);
