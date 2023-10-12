const CategoryModel = require("../models/Category.model");


module.exports.get = async (req, res) => {
    const categories = await CategoryModel.find({})
    return res.json(categories);
};

module.exports.count = async (req, res) => {
    const count = await CategoryModel.countDocuments();
    return res.json(count)
}