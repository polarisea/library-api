const { model, Schema } = require("mongoose");

const { ROLES } = require("../constants");

const schema = new Schema(
  {
    role: {
      type: Number,
      default: ROLES.user.value,
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
    indexedContent: {
      type: String,
      require: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "user" }
);

module.exports = model("User", schema);
