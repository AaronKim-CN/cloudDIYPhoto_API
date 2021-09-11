const Albums = require('../models/Albums');
const s3methods = require('../lib/s3methods');

module.exports = {
    
    getAlbums: function(req, res, next) {
        console.log("get albums");
        Albums.find(function(err, albums){
            if(err) return console.error(err);
            console.log(albums);
            res.send(albums);
        })
    },
    addNewAlbum: function (req, res, next) {

        // Carete virtual directory in the S3 Bucket.
        s3methods.createDicrectory(req.body.albumid);

        const newAlbum = new Albums(
            req.body
        )

        newAlbum.save(function (err, newAlbume) {
            if (err) return console.error(err);
            res.send("Data insert successfully");
        })
    }
}