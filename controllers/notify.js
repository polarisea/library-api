const NotifyModel = require("../models/Notify.model");
const { Types } = require("mongoose");

const { PAGE_SIZE } = require("../constants");

module.exports.get = async (req, res) => {
  const { receiver, page } = req.query;

  try {
    const query = {};
    // if (receiver == "normal") {
    //   query["receiver"] = null;
    // }
    // if (receiver ) {
    query["receiver"] = { $in: [receiver, null] };
    // } else {
    // query["receiver"] = null
    // }
    const notifies = await NotifyModel.find(query)
      .sort({ createdAt: -1 })
      .skip(page * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .populate({
        path: "receiver",
        select: "name",
      });

    return res.json(notifies);
  } catch (error) {
    console.log(error.message);
  }
  return res.sendStatus(400);
};

module.exports.count = async (req, res) => {
  const { receiver } = req.query;

  try {
    const query = {};
    query["receiver"] = { $in: [receiver, null] };
    const notifies = await NotifyModel.countDocuments(query);

    return res.json(notifies);
  } catch (error) {
    console.log(error.message);
  }
  return res.sendStatus(400);
};

module.exports.create = async (req, res) => {
  const { title, content, receiver } = req.body;
  console.log(req.body);
  try {
    const notify = await NotifyModel.create({
      receiver,
      title,
      content,
    });
    return res.json(notify);
  } catch (error) {}
  return res.sendStatus(400);
};

module.exports.deleteNotify = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await NotifyModel.findByIdAndRemove(id);
    if (deleted) return res.json(id);
  } catch (error) {}
  return res.sendStatus(400);
};
