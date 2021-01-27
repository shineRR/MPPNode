const express = require('express')
const path = require('path')
const app = express()
const port = 3000

app.use(express.static(__dirname + '/public'))


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/views/main.html'));
})

app.post('/', function (req, res) {
    res.send('Got a POST request')
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