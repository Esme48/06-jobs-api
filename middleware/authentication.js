const User = require('../models/User')
const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors')


const auth = (req, res, next) => {

    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        throw new UnauthenticatedError('Authentication Invalid')
    }

    const token = authHeader.split(' ')[1] //We turn this into an array, and looking for the second item in that array

    try{
        const payload = jwt.verify(token, process.env.JWT_SECRET)

        req.user = { userId: payload.userId, name:payload.name }
        next()

    } catch(error){
        throw new UnauthenticatedError('Authentication Invalid')
    }
}

module.exports = auth