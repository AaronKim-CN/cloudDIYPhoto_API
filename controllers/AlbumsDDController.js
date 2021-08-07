const Albums = require('../models/AlbumsDD');
const s3methods = require('./s3methods');

module.exports = {
    
    getAlbums: function(req, res, next) {
        console.log("get albums");
        // Get all albums from DB.
        Albums.scan().exec((error, albums) => {
            if (error) {
                console.error(error);
            } else {
                console.log(albums);
                res.send(albums);
            }
        })

    },
    addNewAlbum: function (req, res, next) {

        // Carete virtual directory in the S3 Bucket.
        s3methods.createDicrectory(req.body.albumid);
        
        // Data from Front
        let databody = req.body;
        const newAlbum = new Albums(
            databody
        )
        
        // Save data from Front to DB
        newAlbum.save(function (err, newAlbume) {
            if (err) return console.error(err);
            res.send("Data insert successfully");
        })
    }
}