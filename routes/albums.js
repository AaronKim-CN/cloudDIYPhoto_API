const express = require('express')
var router = express.Router();

// // MongoDB
// var AlbumsController = require('../controllers/AlbumsControllers');

// Migrate to DynamoDB
var AlbumsController = require('../controllers/AlbumsDDController');

router.get('/', AlbumsController.getAlbums);
router.post('/', AlbumsController.addNewAlbum);

module.exports = router;