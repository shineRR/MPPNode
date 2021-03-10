const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const flightRouter = require("./server/routes/flightRouter");
const authRouter = require("./server/routes/authRouter");

const app = express()
const port = 3000

const dbURI = 'mongodb+srv://admin:admin@mpp.zysk6.mongodb.net/mpp-lab?retryWrites=true&w=majority'
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
    .then((result) => console.log('connected to db'))
    .catch((error) => console.log(error))

app.use(express.static(__dirname + '/client'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());

app.use("", flightRouter);
app.use("", authRouter);

app.get('*', async (req, res) => {
    res.sendFile(__dirname + "/client/index.html");
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})