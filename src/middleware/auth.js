const jwt = require('jsonwebtoken')
const User = require('../models/userSch')

const SECRET = process.env.SECRET_KEY


const auth = async (req, res, next) => {
    try{

        const token = req.cookies.jwt
        const verifyUser = jwt.verify(token, SECRET)

        // can access only user specific info
        const user = await User.findOne({_id: verifyUser._id})

        req.token = token
        req.user = user
        
        next()
    }

    catch(error){
        // console.log('Not Authentic')
        res.status(401).send(error)
    }
}

module.exports = auth