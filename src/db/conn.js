require('dotenv').config()
const mongoose = require('mongoose')
const password = process.env.PASSWORD

mongoose.connect(`mongodb+srv://rajdeep999:${password}@cluster0.k4qtj1r.mongodb.net/?retryWrites=true&w=majority`)
.then( () => {
    // console.log('Connection to database successful')
})
.catch( (err) => {
    console.log('Error in making database connection' + err)
})