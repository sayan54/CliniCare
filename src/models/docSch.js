const mongoose = require('mongoose')

const docSchema = new mongoose.Schema({
    person_id: {
        type: String
    },
    docName: {
        type: String,
        required: true
    },
    date: {
        type: Date
    },
    visitDate: {
        type: Date,
        required: true
    },
    description: {
        type: String,
    },
    // file: {
    //     type: Binary data,
    // }
})

const Document = mongoose.model('Document', docSchema)

module.exports = Document