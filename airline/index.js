const mongoose = require('mongoose')
const express = require("express");
const socketIO = require("socket.io");
const http = require('http');
const Flight = require('./server/Model/flight')
const User = require('./server/Model/user');
const b_crypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookie = require("cookie");

// App setup
const PORT = 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Static files
app.use(express.static("public"));

app.use(express.static(__dirname + "/client/"));

const dbURI = 'mongodb+srv://admin:admin@mpp.zysk6.mongodb.net/mpp-lab?retryWrites=true&w=majority'
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
    .then((result) => console.log('connected to db'))
    .catch((error) => console.log(error))

io.on("connection", function (socket) {
    console.log("Made socket connection");

    socket.on('auth', (user) => {
        console.log("/auth", user);
    
        User.find({ email: user.email}, (err, docs) => {
            if (docs.length == 0) {
                console.log(docs)
                io.emit('auth', "Not Found!");
            } else {
                const userFromDB = docs[0];
                console.log(userFromDB);
                const even = b_crypt.compareSync(user.password, userFromDB.password);
                if (even) {
                    const token = jwt.sign({
                        email: userFromDB.email
                    }, "SECRET_KEY", {expiresIn: 60 * 60});
            
                    console.log("Cookie");
                    const cookie = 'token=' +
                        'Bearer '+ token

                    socket.handshake.headers["cookie"] = cookie
                    io.emit('auth', null);
                } else {
                    
                    io.emit('auth', "Password doesn't match.");
                }
            }
        })
    });

    socket.on('register', (userInstance, flag) => {
        const password = userInstance.password
        const salt = b_crypt.genSaltSync(10);
        const user = new User({
            email: userInstance.email,
            password: b_crypt.hashSync(password, salt)
        })
    
        User.find({ email: user.email }, (err, docs) => {
            if (docs.length == 0) {
                user.save();
                io.emit('register', null);
            } else {
                io.emit('register', "Already exists.");
            }
        });
    });

    socket.on('addFlights', (message) => {
        const flight = new Flight(message)
        console.log(flight)
        flight.save()
            .then((result) => io.emit('addFlights', flight))
            .catch((error) => console.log("error"))
    });

    socket.on('updateFlight', (id, flight) => {
        const flightInstance = new Flight(flight)
    
        Flight.findByIdAndUpdate(id, flightInstance)
            .then((result) =>  io.emit('updateFlight', flight))
            .catch((error) => console.log(err))
    });

    socket.on('deleteFlight', (id) => {
        Flight.findByIdAndDelete(id, function (err, docs) { 
            if (err) { 
                console.log(err)
            } 
            else { 
                io.emit('deleteFlight', { message: "Success"})
            } 
        });
    });

    socket.on('flights', (message) => {
        Flight.find()
        .then((result) => {
            io.emit("flights", result)
        })
        .catch((err) => {
            io.emit("flights")
        })
    });
});

server.listen(PORT, () => {
    console.log(`Server is up and running on port ${PORT}`);
});