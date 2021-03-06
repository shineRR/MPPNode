const cors = require('cors');
const express = require('express')
const mongoose = require('mongoose')
const router = require("./server/routes/route");
const bodyParser = require('body-parser')

const app = express()
const port = process.env.PORT || 3000

const dbURI = 'mongodb+srv://admin:admin@mpp.zysk6.mongodb.net/mpp-lab?retryWrites=true&w=majority'
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
    .then((result) => console.log('connected to db'))
    .catch((error) => console.log(error))

app.use(express.static(__dirname + '/client'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

app.use("", router);

app.get('*', async (req, res) => {
    console.log("get page");
    res.sendFile(__dirname + "/client/index.html");
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})