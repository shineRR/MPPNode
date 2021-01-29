const express = require('express')
const router = express.Router()

router.get('/:id', function (req, res, next) {
    const filePath = process.cwd() + "/uploads/" + req.params.id
    res.sendFile(filePath)
})

module.exports = router