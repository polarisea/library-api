const { model, Schema } = require("mongoose")

const schema = new Schema({
    title: {
        type: String,
        required: true,
    },
},
    { collection: 'category' });

module.exports = model('Category', schema)