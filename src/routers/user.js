const express = require('express')
const router = new express.Router()


// USER related all the pages will be handled here

router.get('/dashboard', (req, res) => {
    res.render('dashboard')
})

router.get('/clinics', (req, res) => {
    res.render('clinics')
})

router.get('/docadd', (req, res) => {
    res.render('docadd')
})

router.get('/clinicadd', (req, res) => {
    res.render('clinicadd')
})

module.exports = router