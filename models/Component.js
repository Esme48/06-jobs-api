const mongoose = require('mongoose')

const ComponentSchema = new mongoose.Schema({
    item:{
        type: String,
        required: [true, 'Please Provide The Name Of Your Item'],
        maxlength: 50
    },
    color:{
        type: String,
        required: [true, 'Please Provide The Color Of Your Item'],
        maxlength: 100
    },
    status:{
        type: String,
        enum: ['Item Pending Review', 'Item Shipped', 'Item Delivered'],
        default: 'Item Pending Review',
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref: 'User', 
        required: [true, 'Please Provide User'],
    },

},{timestamps:true})

module.exports = mongoose.model('Component', ComponentSchema)
