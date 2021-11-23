var express = require('express');
var router = express.Router();
const Users = require('../models/Users');
const Pictures = require('../models/Pictures');
const Albums = require('../models/Albums');
var AlbumsController = require('../controllers/AlbumsControllers');

// We can use this route to easyly test some experiments.

router.get('/', function(req, res, next) {

    // Test response.
    res.send("API Connected! Welcome to Cloud DIY Photo project!!")

});

module.exports = router;