const AuthorModel = require("../models/Author.model");


module.exports.get = async (req, res) => {
    const categories = await AuthorModel.find({})
    return res.json(categories);
};

module.exports.count = async (req, res) => {
    const count = await AuthorModel.countDocuments();
    return res.json(count)
}