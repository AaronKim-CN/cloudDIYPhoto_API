const express = require('express')
var router = express.Router();

const authenticateJWT = require('../lib/authenticateJWT');
//var PicturesController = require('../controllers/PictureControllers');
var PicturesController = require('../controllers/PictureDDController');

// File upload folders
var multer  = require('multer');
var upload = multer({ 
    dest: 'uploads/', 
    limits: {
        fieldSize: 25 * 1024 * 1024 
    }

})

// Routers
//router.post('/', authenticateJWT, PicturesController.addNewPicture);
router.get('/', authenticateJWT, PicturesController.getPictures);
// Get a random image from the album
router.get('/:albumid/random', PicturesController.getOneRandomImage);
// Get all original images of an album.
router.get('/:albumid', authenticateJWT, PicturesController.getPicturesOfAlbum);
// Get all thumnails of an album. But, get original images if the image don't have a thumnail.
router.get('/:albumid/thumnail', authenticateJWT, PicturesController.getThumnailsOfAlbum);
// Upload image to an album.
router.post('/:albumid/upload', authenticateJWT, upload.single('formtest'), PicturesController.uploadNewPicture);
// Get the original image of a thumnnail.
router.get('/:albumid/:thumnailid', PicturesController.getOriginalImageByThumnail);

module.exports = router;