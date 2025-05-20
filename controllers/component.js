const Component = require('../models/Component')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, NotFoundError} = require('../errors')

const getAllComponents = async (req, res) => {
    res.send('Get All Components')
}

const getComponent = async (req, res) => {
    res.send('Get Component')
}
const createComponent = async (req, res) => {
    req.body.createdBy = req.user.userId
    const component = await Component.create(req.body)
    res.status(StatusCodes.CREATED).json({ component })
}

const updateComponent = async (req, res) => {
    res.send('Update Component')
}

const deleteComponent = async (req, res) => {
    res.send('Delete Component')
}


module.exports = {
    getAllComponents,
    getComponent,
    createComponent,
    updateComponent,
    deleteComponent,

}