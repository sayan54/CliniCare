const express = require('express')
const router = new express.Router()
const bodyParser = require('body-parser')
const auth = require('../middleware/auth')
const cookieParser = require('cookie-parser')

const User = require('../models/userSch')

router.use(express.json())
router.use(bodyParser.urlencoded({ extended: false}))
router.use(bodyParser.json())
router.use(cookieParser())

// USER related all the pages will be handled here

router.get('/dashboard', auth, (req, res) => {
    res.render('dashboard', {
        username: req.user.username
    })
})

router.get('/clinics', auth, (req, res) => {
    res.render('clinics', {
        username: req.user.username
    })
})

router.get('/docadd', auth, (req, res) => {
    res.render('docadd', {
        username: req.user.username
    })
})

router.get('/clinicadd', auth, (req, res) => {
    res.render('clinicadd', {
        username: req.user.username
    })
})


//  ----****** Sign Up User ******----
router.post('/signup', async (req, res) => {

    try {
        const pw = req.body.password
        const cpw = req.body.confirmpassword

        if (pw != cpw) {
            console.log('Passwords are not matching')
            return res.status(400).render('home')
        }

        const user = new User(req.body)


        // before calling the save method password must be hashed
        const createUser = await user.save()

        res.status(201).render('signup')
    }

    catch (err) {
        console.log('Error found while sign up' + err)
        res.status(400).send(err)
    }
})


// ********* Sign In User *********
router.post('/signin', async (req, res) => {

    try {
        const email = req.body.email
        const password = req.body.password

        const user = await User.checkLoginDetails(email, password)

        const token = await user.generateAuthToken()

        res.cookie('Clinicare', token, {
            expires: new Date(Date.now() + 24 * 60 * 60 * 10),
            httpOnly: true
        })

        res.status(200).redirect('dashboard')
    }

    catch (error) {
        // console.log(req.body)
        res.status(400).send('Sahi se Details dee bhai')
    }
})


router.post('/docadd', auth, (req, res) => {
    res.render('docadd')
})


module.exports = router