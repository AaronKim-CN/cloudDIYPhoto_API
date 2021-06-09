const express = require('express');
const Pictures = require('../models/Pictures');

module.exports = {
    
    addNewPicture: function (req, res, next) {
        console.log("Post request came to controller");
        console.log(req.body);

        const newPicture = new Pictures(
            req.body
        )

        newPicture.save(function (err, newPicture) {
            if (err) return console.error(err);
            res.send("Data insert successfully");
        })

    },
    getPictures: function (req, res, next) {
        console.log("Get request came to controller");
        console.log(req);
        res.send("successed!!");
    }
}