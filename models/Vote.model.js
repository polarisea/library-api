const { model, Schema } = require("mongoose")
const UserModel = require("./User.model")
const BookModel = require("./Book.model")

const schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    book: {
        type: Schema.Types.ObjectId,
        ref: 'Book',
    },
    value: {
        type: Number,
        required: true
    },
},
    { collection: 'vote' });

module.exports = model('Vote', schema)