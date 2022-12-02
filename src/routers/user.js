const express = require('express')
const router = new express.Router()
const bodyParser = require('body-parser')
const auth = require('../middleware/auth')

const User = require('../models/userSch')

router.use(express.json())
router.use(bodyParser.urlencoded({extended: true}))

// USER related all the pages will be handled here

router.get('/dashboard', auth, (req, res) => {
    res.render('dashboard')
})

router.get('/clinics', auth, (req, res) => {
    res.render('clinics')
})

router.get('/docadd', auth, (req, res) => {
    res.render('docadd')
})

router.get('/clinicadd', auth, (req, res) => {
    res.render('clinicadd')
})


//  ****** Sign Up User ******
router.post('/signup', async (req, res) => {

    try
    {
        const user = new User(req.body)

        const pw = req.body.password
        const cpw = req.body.password

        if(pw != cpw){
            console.log('Passwords are not matching')
            return res.status(400).render('home')
        }

        const token = await user.generateAuthToken()

        // console.log('Your auth token is :' + token)

        // setting up the cookie with the value
        res.cookie('jwt', token, {
            expires: new Date(Date.now() + 30000),
            httpOnly: true
        })

        // console.log(user)

        // before calling the save method password must be hashed
        const createUser = await user.save()

        // console.log(createUser)

        res.status(201).redirect('/signup')
    }

    catch(err){
        console.log('Error found while sign up' + err)
        res.status(400).send(err)
    }
})


// ********* Sign In User *********
router.post('/signin', async (req, res) => {

    try{

        const email = req.body.email
        const password = req.body.password

        const user = await User.checkLoginDetails(email, password)
        
        const token = await user.generateAuthToken()

        res.cookie('login', token, {
            expires: new Date(Date.now() + 30000),
            httpOnly: true
        })

        res.status(200).render('dashboard')
    }


    catch(error){
        console.log(req.body)
        res.status(400).send('Sahi se Details dee bhai')
    }
})



module.exports = router