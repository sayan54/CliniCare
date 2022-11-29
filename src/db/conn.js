const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/clinicare')
.then( () => {
    console.log('Connection to database successful')
})
.catch( (err) => {
    console.log('Error in making database connection' + err)
})