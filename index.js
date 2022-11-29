require('./src/db/conn')
const express = require('express')

const app = express()

app.set('view engine', 'ejs')


app.use(express.static('public'))


const port = process.env.PORT || 3000

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/signup', (req, res) => {
    res.render('signup')
})

app.get('/dashboard', (req, res) => {
    res.render('dashboard')
})

app.get('/docadd', (req, res) => {
    res.render('docadd')
})

app.get('/clinics', (req, res) => {
    res.render('clinics')
})



app.listen(port, () => {
    console.log(`Server is up & running on port ${port}`)
})