var express = require("express");
var router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const user = require('../models/user')


router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
    console.log(req.originalUrl);
    return res.json({
        "username": "test"
    })
})

router.get('/token', (req, res) => {
    console.log(req.originalUrl);
    // var payload = {
    //     name: "suman",
    //     email: "test.com"
    // };
    // var token = jwt.sign(payload, 'suman');
    const token = jwt.sign({
        type: "user",
        data: {
            name: "suman",
            email: "test.com"
        }
    }, 'suman', {
        expiresIn: 60
    });

    return res.json({
        success: true,
        token: "token " + token
    });
})
//exports
module.exports = router