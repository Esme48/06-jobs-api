const express = require('express')
const router = express.Router()

const {
    getAllComponents, 
    getComponent, 
    createComponent, 
    updateComponent, 
    deleteComponent,
} = require ('../controllers/component')

router.route('/').post(createComponent).get(getAllComponents)
router.route('/:id').get(getComponent).delete(deleteComponent).patch(updateComponent)


module.exports = router