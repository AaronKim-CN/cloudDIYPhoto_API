const express = require('express')
var router = express.Router();

var AlbumsController = require('../controllers/AlbumsControllers');

router.get('/', AlbumsController.getAlbums);
router.post('/', AlbumsController.addNewAlbum);

module.exports = router;