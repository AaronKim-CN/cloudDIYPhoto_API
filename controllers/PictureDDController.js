const Pictures = require('../models/PicturesDD');
const { v4: uuidv4 } = require('uuid');
const AWS = require('aws-sdk');
let s3 = new AWS.S3();

function getSignedUrl(bucketname, s3key) {

    const signedUrlExpireSeconds = 60 * 5;
    const url = s3.getSignedUrl('getObject', {
        Bucket: bucketname,
        Key: s3key,
        Expires: signedUrlExpireSeconds
    })

    return url
}

module.exports = {
    
    addNewPicture: function (req, res, next) {
        console.log("Post request came to controller");
        console.log(req.body);
        let databody = req.body;
        // Add new data to DataBody
        databody['masterkey'] = uuidv4();

        const newPicture = new Pictures(
            databody
        )
        // Save data to DB
        newPicture.save(function (err, newPicture) {
            if (err) return console.error(err);
            res.send("Data insert successfully");
        })

    },
    getPictures: function (req, res, next) {
        console.log("Get request came to controller");
        console.log(req);
        
        res.send("successed!!");
    },
    getOneRandomImage: function (req, res,next) {
        console.log("Get one Random Images");
        console.log(req.params);
        Pictures.scan("album").contains(req.params.albumid).limit(1).exec((error, picture) => {
            if (error) {
                console.error(error);
            } else {
                console.log(picture);
                console.log(picture.count);
                // Send a Default Picture if there is no images in the album.
                if (picture.count == 0) {
                    // Change to a internal link.
                    const url = "https://cdn.vox-cdn.com/thumbor/Pkmq1nm3skO0-j693JTMd7RL0Zk=/0x0:2012x1341/1200x800/filters:focal(0x0:2012x1341)/cdn.vox-cdn.com/uploads/chorus_image/image/47070706/google2.0.0.jpg";
                    res.redirect(url);

                } else {

                    // Get the file key from the DB
                    let tmp_s3key = picture[0].s3key;
                    // Create s3 key by add albumid with file key.
                    let s3key = req.params.albumid + "/" + tmp_s3key;
                    // Get signed image URL of S3.
                    const url = getSignedUrl(process.env.MyPhotoBucket, s3key)

                    res.redirect(url);
                }
            }
        })
    },
    getPicturesOfAlbum: function(req, res, next) {
        console.log("Get all images of an album");
        // Get a Picture List of an album from DB.
        Pictures.scan("album").contains(req.params.albumid).exec((error, pictures) => {
            if (error) {
                console.log(error);
                res.send("Error happens");

            } else {
                console.log(pictures);
                let data_list = []
                if (pictures.count == 0) {
                    console.log("no data in the album.");
                    res.send(data_list);
                } else {

                    pictures.forEach(picture => {

                        let s3key = req.params.albumid + "/" + picture.s3key;
                        // Get signed image URL of S3.
                        let url = getSignedUrl(process.env.MyPhotoBucket, s3key);

                        // Create Sturctured Data.
                        const tmp = {}
                        tmp["img"] = url;
                        tmp["title"] = picture.filename;
                        tmp["place"] = picture.place;

                        data_list.push(tmp)

                    })

                    res.send(data_list);
                }
                
            }
        })
    }
}