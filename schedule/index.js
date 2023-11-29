const cron = require("node-cron");
const ContractModel = require("../models/Contract");
const NotifyModel = require("../models/Notify.model");
const BookModel = require("../models/Book.model");
const { CONTRACT_TYPES } = require("../constants");
const {
  createAuthors,
  createCatgories,
  createPublishers,
} = require("../cache");
// migrate();

module.exports.setSchedule = async () => {
  console.log("Start set schedule");
  const categories = await BookModel.distinct("categories");
  const publishers = await BookModel.distinct("publishers");
  const authors = await BookModel.distinct("authors");

  createCatgories(categories);
  createPublishers(publishers);
  createAuthors(authors);
  // console.log(categories);
  cron.schedule("25 23 * * *", async () => {
    try {
      console.log("Check contracts");
      await ContractModel.updateMany(
        { status: { $ne: CONTRACT_TYPES.violation }, to: { $lt: new Date() } },
        { $set: { status: CONTRACT_TYPES.violation } }
      );

      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      await NotifyModel.deleteMany({ createdAt: { $lt: oneMonthAgo } });
    } catch (e) {
      console.log(e.message);
    }
  });
};
