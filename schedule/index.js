const cron = require("node-cron");
const ContractModel = require("../models/Contract");
const { CONTRACT_TYPES } = require("../constants");
// migrate();

module.exports.setSchedule = () => {
  console.log("Start set schedule");
  cron.schedule("25 23 * * *", async () => {
    try {
      console.log("Check contracts");
      await ContractModel.updateMany(
        { status: { $ne: CONTRACT_TYPES.violation }, to: { $lt: new Date() } },
        { $set: { status: CONTRACT_TYPES.violation } }
      );
    } catch (e) {
      console.log(e.message);
    }
  });
};
