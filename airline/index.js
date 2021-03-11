const mongoose = require('mongoose')
const express = require("express");
const socketIO = require("socket.io");
const http = require('http');
const Flight = require('./server/Model/flight')
const User = require('./server/Model/user');
const b_crypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// App setup
const PORT = 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Static files
app.use(express.static(__dirname + "/client/"));

const dbURI = 'mongodb+srv://admin:admin@mpp.zysk6.mongodb.net/mpp-lab?retryWrites=true&w=majority'
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
    .then((result) => console.log('connected to db'))
    .catch((error) => console.log(error))

function auth(token){
    try {
        if (token === null){
            console.log("no token");
            throw new Error();
        }
        const data = jwt.verify(token, "SECRET_KEY");
        console.log("is valid");
        return true;
    } catch (error) {
        console.log("Unauthorized");
        return false;
    }
}    

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
                    const cookie = token

                    socket.handshake.headers["cookie"] = cookie;
                    console.log(cookie);
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
        if (auth(socket.handshake.headers['cookie'])) {
            const flight = new Flight(message)
            console.log(flight)
            flight.save()
                .then((result) => io.emit('addFlights', flight))
                .catch((error) => console.log("error"))
        } else {
            io.emit('addFlights', "Unauthorized user")
        }
    });

    socket.on('updateFlight', (id, flight) => {
        if (auth(socket.handshake.headers['cookie'])) {
        const flightInstance = new Flight(flight)
    
        Flight.findByIdAndUpdate(id, flightInstance)
            .then((result) =>  io.emit('updateFlight', flight))
            .catch((error) => console.log(err))

        } else {
            io.emit('updateFlight', "Unauthorized user")
        }
    });

    socket.on('deleteFlight', (id) => {
        if (auth(socket.handshake.headers['cookie'])) {
            Flight.findByIdAndDelete(id, function (err, docs) { 
                if (err) { 
                    console.log(err)
                } 
                else { 
                    io.emit('deleteFlight', { message: "Success"})
                } 
            });
        } else {
            io.emit('deleteFlight', { message: "Unauthorized user"})
        }
    });

    socket.on('flights', (message) => {
        if (auth(socket.handshake.headers['cookie'])) {
            Flight.find()
            .then((result) => {
                io.emit("flights", result)
            })
            .catch((err) => {
                io.emit("flights", [])
            })
        } else {
            io.emit("flights", "Unauthorized user")
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server is up and running on port ${PORT}`);
});