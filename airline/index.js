const express = require('express')
const mongoose = require('mongoose')
const Flight = require('./Model/flight')
const bodyParser = require('body-parser')
const multer = require('multer')
const upload = multer({dest: "uploads/"})
const app = express()
const path = require('path')
const port = 3000

const dbURI = 'mongodb+srv://admin:admin@mpp.zysk6.mongodb.net/mpp-lab?retryWrites=true&w=majority'
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then((result) => console.log('connected to db'))
    .catch((error) => console.log(error))

app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(upload.array());

app.set('view engine', 'ejs')

const render = async(res) => {
    Flight.find()
        .then((result) => {
            res.render("home", {
                flights: result
            })
        })
        .catch((err) => {
            res.send(err)
        })
}

app.get('/', async (req, res) => {
    await render(res)
})

app.post('/', upload.single("file"), async (req, res) => {
    const { destination, date, price } = req.body
    const { file } = req

    const flight = new Flight({
        destination: destination,
        date: date,
        file: file.path,
        price: price
    })
    await flight.save()
    await render(res)
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})