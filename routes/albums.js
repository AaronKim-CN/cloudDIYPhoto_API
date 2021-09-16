const express = require('express');
var router = express.Router();

const authenticateJWT = require('../lib/authenticateJWT');

// // MongoDB
// var AlbumsController = require('../controllers/AlbumsControllers');

// Migrate to DynamoDB
var AlbumsController = require('../controllers/AlbumsDDController');

router.get('/', authenticateJWT, AlbumsController.getAlbums);
router.post('/',authenticateJWT, AlbumsController.addNewAlbum);

module.exports = router;