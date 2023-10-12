const { model, Schema } = require("mongoose");

const schema = new Schema(
  {
    fb: {
      type: String,
      require: true,
    },
    name: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
      require: true,
    },
    role: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "user" },
);

module.exports = model("User", schema);
