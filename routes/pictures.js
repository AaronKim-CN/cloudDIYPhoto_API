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
router.get('/:albumid/random', PicturesController.getOneRandomImage);
router.get('/:albumid', authenticateJWT, PicturesController.getPicturesOfAlbum);
router.post('/:albumid/upload', authenticateJWT, upload.single('formtest'), PicturesController.uploadNewPicture);

module.exports = router;