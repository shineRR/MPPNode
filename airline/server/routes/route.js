const { json } = require('body-parser');
const express = require('express')
const Flight = require('../Model/flight');
const router = express.Router()

const render = (res) => {
    Flight.find()
        .then((result) => {
            res.status(200),json(result)
        })
        .catch((err) => {
            res.status(404)
        })
}

router.get('/api/flights', (req, res) => {
    Flight.find()
    .then((result) => {
        res.status(200).json(result)
    })
    .catch((err) => {
        res.status(404)
    })
});

router.get('/:id', (req, res) => {
    const filePath = process.cwd() + "/uploads/" + req.params.id
    res.sendFile(filePath)
});

router.post('/api/flights', (req, res) => {
    const flight = new Flight(req.body)
    console.log(flight)
    flight.save()
        .then((result) => res.status(201).json(flight))
        .catch((error) => res.status(401))
});

router.put('/api/flights/:id', (req, res) => {
    const id = req.params.id
    const flight = new Flight(req.body)

    Flight.findByIdAndUpdate(id, flight)
        .then((result) => res.status(200).json(flight))
        .catch((error) => console.log(err))
});

router.delete('/api/flights/:id', (req, res) => {
    const id = req.params.id

    Flight.findByIdAndDelete(id, function (err, docs) { 
        if (err){ 
            res.status(404)
        } 
        else { 
            res.status(200).json({message: 'Deleted.'})
        } 
    }); 
});

module.exports = router