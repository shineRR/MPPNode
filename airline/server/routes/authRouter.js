const express = require('express');
const User = require('../Model/user');
const b_crypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router()

router.post("/auth", (req, res) => {

    console.log("/auth")
    const password = req.body.password
    let user;

    User.find({ email: req.body.email}, (err, docs) => {
        if (docs.length == 0) {
            console.log(docs)
            res.status(404).json({message: 'Not found.'});
        } else {
            const user = docs[0];
            console.log(user);
            const even = b_crypt.compareSync(password, user.password);
            if (even) {
                const token = jwt.sign({
                    email: user.email
                }, "SECRET_KEY", {expiresIn: 60 * 60});
        
                console.log("Cookie");
                res.status(200)
                    .cookie('token',
                        'Bearer '+ token,
                        {
                            HttpOnly: true,
                            secure: false,
                            //maxAge: 60 * 60 * 60
                        })
                    .json({message_jwt: "jwt is created"});
            } else {
                res.status(401).json({message: "Password doesn't match."});
            }
        }
    })
});

router.post("/register", (req, res) => {
    const password = req.body.password
    const salt = b_crypt.genSaltSync(10);
    const user = new User({
        email: req.body.email,
        password: b_crypt.hashSync(password, salt)
    })

    User.find({ email: user.email }, (err, docs) => {
        if (docs.length == 0) {
            user.save();
            res.status(201).json(user);
        } else {
            res.status(409).json({message: 'Already exists.'});
        }
    });
});

module.exports = router