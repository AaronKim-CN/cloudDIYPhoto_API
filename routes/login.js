const express = require('express')
var router = express.Router();

var LoginController = require('../controllers/LoginDDControllers');

router.post('/', LoginController.login);

module.exports = router;