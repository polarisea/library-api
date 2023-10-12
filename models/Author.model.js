const { model, Schema } = require("mongoose")
const schema = new Schema({
    name: {
        type: String,
        required: true,
    },
},
    { collection: 'author' });

module.exports = model('Author', schema)