const express = require('express')
const app = express()
const path = require('path')
const port = 3000
const mongoose = require('mongoose');
const Flight = require('./Model/flight')

const dbURI = 'mongodb+srv://admin:admin@mpp.zysk6.mongodb.net/mpp-lab?retryWrites=true&w=majority'
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then((result) => console.log('connected to db'))
    .catch((error) => console.log(error))

app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    Flight.find()
        .then((result) => {
            res.send(result)
        })
        .catch((err) => {
            res.send(err)
        })
})

app.post('/', function (req, res) {
    res.send('Got a POST request')
    // const flight = new Flight({
    //     destination: "Moscow",
    //     date: "2Sep",
    //     file: 'nil',
    //     price: 100
    // })
    // flight.save()
    //     .then((result) => console.log(result))
    //     .catch((err) => console.log(err))
})

app.put('/user', function (req, res) {
    res.send('Got a PUT request at /user');
})

app.delete('/user', function (req, res) {
    res.send('Got a DELETE request at /user');
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})