var express = require('express');
var router = express.Router();
const Users = require('../models/Users');
const Pictures = require('../models/Pictures');
const Albums = require('../models/Albums');

var AlbumsController = require('../controllers/AlbumsControllers');

router.get('/', function(req, res, next) {

    // Users.getUsersByID("admin").then((result) => {
    //     res.send(result);
    // })

    // Pictures.find().searchall().exec()
    // .then(result => {
    //     res.send(result);
    // })
    // .catch(err => {
    //     console.log(err);
    // })

    // AlbumsController.addNewAlbum()
    // res.send("success")
    Albums.find().exec()
    .then(result => {
        res.send(result);
    })
    .catch(err => {
        console.log(err);
    })

    // const newPicture = new Pictures(
    //     {
    //         filenname: 'test003',
    //         album: 'album3',
    //         time: '20210825',
    //         s3key: 'test.jpg',
    //         place: 'Tokyo',
    //         tags: ['s3','d3']
    //     }
    // )

    // newPicture.save(function (err, newPicture) {
    //     if (err) return console.error(err);
    //     console.log("Data Inserted");
    // })


});

module.exports = router;