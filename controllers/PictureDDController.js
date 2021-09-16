const Pictures = require('../models/PicturesDD');
const { v4: uuidv4 } = require('uuid');
const s3methods = require('../lib/s3methods');

module.exports = {
    
    getPictures: function (req, res, next) {
        console.log("Get request came to controller");
        console.log(req);
        res.send("successed!!");
    },
    getOneRandomImage: function (req, res,next) {
        console.log("Get one Random Images");

        Pictures.scan("album").contains(req.params.albumid).limit(1).exec((error, picture) => {
            if (error) {
                console.error(error);
            } else {
                console.log(picture);
                console.log(picture.count);
                // Send a Default Picture if there is no images in the album.
                if (picture.count == 0) {
                    // Change to a Default image
                    const url = req.headers.referer + "logo192.png";
                    res.redirect(url);

                } else {

                    // Get the file key from the DB
                    let tmp_s3key = picture[0].s3key;
                    // Create s3 key by add albumid with file key.
                    let s3key = req.params.albumid + "/" + tmp_s3key;
                    // Get signed image URL of S3.
                    const url = s3methods.getSignedUrl(process.env.MyPhotoBucket, s3key)
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
                        let url = s3methods.getSignedUrl(process.env.MyPhotoBucket, s3key);

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
    },
    uploadNewPicture: function(req, res, next) {
        
        console.log("upload new picture to S3 and add meta data to DB");
        buf = Buffer.from(req.body.file.replace(/^data:image\/\w+;base64,/, ""),'base64');

        // Upload image to S3.
        s3methods.postimagetodirectory(req.body.loadfilename, buf, req.params.albumid).then((result)=>{
            
            // Add meta information to DB
            let databody = {};
            databody['filename'] = req.body.filename;
            databody['place'] = req.body.place;
            databody['tags'] = req.body.tags;
            databody['s3key'] = req.body.loadfilename;
            databody['album'] = req.params.albumid;
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

        })

    }
}