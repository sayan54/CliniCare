const mongoose = require('mongoose')

const docSchema = new mongoose.Schema({
    docName: {
        type: String,
        required: true
    },
    clinicName: {
        type: String,
        required: true
    },
    visitDate: {
        type: Date,
        required: true
    },
    description: {
        type: String
    },
    files: [
        {
            file: {
                type: File,
                unique: true
            }
        }
    ]
})

const Document = mongoose.model('Document', docSchema)

module.exports = Document