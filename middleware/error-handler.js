const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {

let customError = {
  statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
  msg: err.message || 'Something Went Wrong Try Again Later'
}

  if(err.name === 'ValidationError') {
    console.log(Object.values(err.errors))
    customError.msg = Object.values(err.errors).map((item) => item.message).join(',')
    customError.statusCode = 400
  }
  //if (err instanceof CustomAPIError) {
   // return res.status(err.statusCode).json({ msg: err.message })
  //}
  if (err.code && err.code === 11000){
    customError.msg = `Duplicate Value Entered For ${Object.keys(err.keyValue)} Field, Please Choose Another Value`
    customError.statusCode = 400
  }

  if(err.name === 'CastError'){
    customError.msg = `No Item found With Id : ${err.value} `
    customError.statusCode = 404
  }
  return res.status(customError.statusCode).json({ msg: customError.msg })
}

module.exports = errorHandlerMiddleware
