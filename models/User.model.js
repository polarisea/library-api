const { model, Schema } = require("mongoose");

const schema = new Schema(
  {
    role: {
      type: Number,
      default: 100,
    },
    fb: {
      type: String,
      default: null,
    },
    google: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      default: "No name",
    },
    DOB: {
      type: Date,
      default: null,
    },
    picture: {
      type: String,
      default: null,
    },
    address: {
      type: String,
      default: null,
    },
    phone: {
      type: String,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "user" },
);

module.exports = model("User", schema);
