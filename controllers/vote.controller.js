const { Types } = require("mongoose");
const BookModel = require("../models/Book.model");
const VoteModel = require("../models/Vote.model");

module.exports.vote = async (req, res) => {
  const { value, user, book } = req.body;
  const existedVote = await VoteModel.findOne({
    user: new Types.ObjectId(user),
    book: new Types.ObjectId(book),
  });
  if (existedVote) {
    return res.sendStatus(400);
  }
  const vote = await VoteModel.create({
    user,
    book,
    value,
  });
  await BookModel.findByIdAndUpdate(
    book,
    { $inc: { votes: value } },
    { new: true },
  );

  return res.json(vote);
};
