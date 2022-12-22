const express = require('express')
const router = new express.Router()
const bodyParser = require('body-parser')
const auth = require('../middleware/auth')
const cookieParser = require('cookie-parser')
const multer = require('multer')


const User = require('../models/userSch')
const Clinic = require('../models/clinicSch')
const Document = require('../models/docSch')


router.use(express.json())
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())
router.use(cookieParser())


router.get('/docs/:id', async (req, res) => {
    try{
        const id = req.params.id
        // console.log(id)

        const pic = await Document.findById(id)

        res.set("Content-Type","image/jpg");
        
        res.send(pic.file)

    }catch(error) {
        console.log(error)
    }
})  

// USER related all the pages will be handled here

router.get('/dashboard', auth, async (req, res) => {
    try {
        const person_id = req.user._id

        const all_docs = await Document.find({ "person_id": person_id })

        res.render('dashboard', {
            username: req.user.username,
            documents: all_docs,
        })
    }

    catch (err) {
        res.status(400).send(err)
    }
})

router.get('/clinics', auth, async (req, res) => {
    try {
        const person_id = req.user._id

        const all_clinics = await Clinic.find({ "person_id": person_id })

        res.render('clinics', {
            username: req.user.username,
            clinics: all_clinics,
        })
    }

    catch (err) {
        res.status(400).send(err)
    }
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
        // console.log('Error found while sign up' + err)
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
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            httpOnly: true
        })

        res.status(200).redirect('dashboard')
    }

    catch (error) {
        // console.log(req.body)
        res.status(400).send('Sahi se Details dee bhai')
    }
})


// *********** Log Out User **************
router.get('/logout', auth, async (req, res) => {
    try{

        // log out from all devices
        req.user.tokens = []

        res.clearCookie('Clinicare')

        // console.log('log out success')

        await req.user.save()

        res.status(200).render('home')

    }
    catch(error){
        res.status(500).send(error)
    }
})




// ---- setting up multer storage and call-back function -----
const storage = multer.memoryStorage()

const upload = multer({

    limits: 100000,

    fileFilter(req, file, cb){

        if(file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|PNG|png)$/)){
            cb(undefined, true)
        }

        else{
            cb(new Error("Please upload only .jpg file"))
            cb(undefined,false)
        }
    },
    
    storage
})


router.post('/docadd', auth, upload.single('Prescription'), async (req, res) => {

    try {
        // console.log(req.user)

        // console.log(JSON.parse(JSON.stringify(req.body)))

        // console.log(req)

        const obj = JSON.parse(JSON.stringify(req.body))

        // console.log(obj)
        // console.log(req.file)

        // req.document 
        req.user.file = req.file.buffer

        obj.person_id = req.user._id

        obj.file = req.file.buffer

        // console.log(obj)

        const doc = new Document(obj)

        const createDoc = await doc.save()

        res.render('docadd', {
            username: req.user.username
        })
    }

    catch (error) {
        res.status(400).send(error)
    }
})


router.post('/clinicadd', auth, async (req, res) => {

    try {
        const obj = req.body
        obj.person_id = req.user._id

        // console.log(obj)

        const clinic = new Clinic(req.body)

        const createClinic = await clinic.save()

        res.render('clinicadd', {
            username: req.user.username
        })
    }

    catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
})


module.exports = router