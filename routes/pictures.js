const express = require('express')
var router = express.Router();

var PicturesController = require('../controllers/PictureControllers');

router.post('/', PicturesController.addNewPicture);
router.get('/', PicturesController.getPictures);

module.exports = router;