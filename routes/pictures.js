const express = require('express')
var router = express.Router();

//var PicturesController = require('../controllers/PictureControllers');
var PicturesController = require('../controllers/PictureDDController');

router.post('/', PicturesController.addNewPicture);
router.get('/', PicturesController.getPictures);
router.get('/:albumid/random', PicturesController.getOneRandomImage);
router.get('/:albumid', PicturesController.getPicturesOfAlbum);

module.exports = router;