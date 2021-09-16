const User = require('../models/UserDD');
const jwt = require('jsonwebtoken');

const accessTokenSecret = process.env.JWTTOKENSECRET;

module.exports = {

    login: function(req, res, next) {
        console.log("Login process");
        // Check if the ID/Password is correct.

        // Get all albums from DB.
        User.scan("userid").contains(req.body.username).exec((error, users) => {
            if (error) {
                console.log(error);
                res.send("Error happens");

            } else {

                if (users[0].password == req.body.password){

                    // Login succeeded.
                    // Generate an JWT access token.
                    const accessToken = jwt.sign({ 
                            username: req.body.username,  
                        }, accessTokenSecret);
                    
                    // Send back the Access Token    
                    res.send({
                        token: accessToken
                    })

                } else {

                    res.send("Wrong password");
                }
               
            }
        })

    },
}

