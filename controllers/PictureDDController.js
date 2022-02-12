const Pictures = require('../models/PicturesDD');
const { v4: uuidv4 } = require('uuid');
const s3methods = require('../lib/s3methods');
const sharp = require('sharp');

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
    getThumnailsOfAlbum: function(req, res, next) {

        console.log("Get all Thumnail images of an album");
        // Get a Picture List of an album from DB.
        let keyObj = {}
        let limit = 100
        let results = []
        
        if (req.query.lastKey) {
            keyObj = JSON.parse(req.query.lastKey)
            results = Pictures.scan("album").startAt(keyObj).limit(limit).contains(req.params.albumid).exec()
        } else {
            results = Pictures.scan("album").limit(limit).contains(req.params.albumid).exec()
        }
        
        results.then((pictures) => {
              
            let resbody = {}
            resbody['lastKey'] = pictures.lastKey
            resbody['count'] = pictures.count

            let data_list = []
            if (pictures.count == 0) {
                console.log("no data in the album.");
                res.send(data_list);
            } else {

                pictures.forEach(picture => {

                    // Set thumnail if there are thumnails. 
                    let s3key = ''
                    if (picture.ThumnailKey){
                        s3key = req.params.albumid + "/" + picture.ThumnailKey;
                    } else {
                        s3key = req.params.albumid + "/" + picture.s3key
                    }
                    
                    // Get signed image URL of S3.
                    let url = s3methods.getSignedUrl(process.env.MyPhotoBucket, s3key);

                    // Create Sturctured Data.
                    const tmp = {}
                    tmp["img"] = url;
                    tmp["title"] = picture.filename;
                    tmp["place"] = picture.place;
                    tmp["thumnailkey"] = picture.ThumnailKey;
                    tmp["s3key"] = picture.s3key;

                    data_list.push(tmp)

                })

                resbody['imageData'] = data_list
                res.send(resbody);
            }
                
        })

    },
    getOriginalImageByThumnail: function(req, res, next) {
        // Get original Image by Thumnail Key.
        console.log(req.params.albumid);
        console.log(req.params.thumnailid);
        let query = {
            "album": {"contains": req.params.albumid},
            "ThumnailKey": {"contains": req.params.thumnailid}
        }

        Pictures.scan(query).exec((error, pictures) => {
            if (error) {
                console.log(error);
                res.send("Error happens");
            } else {
                console.log(pictures);
                let data_list = {};
                pictures.forEach(picture => {

                    let s3key = picture.s3key;

                    // Get signed image URL of S3.
                    let url = s3methods.getSignedUrl(process.env.MyPhotoBucket, s3key);

                    data_list["img"] = url;
                    data_list["title"] = picture.filename;
                    data_list["place"] = picture.place;

                })
                
                res.send(data_list);

            }
        })

    },
    getOriginalImageByS3key: function(req, res, next) {
        // Get original Image by Thumnail Key.
        console.log(req.params.albumid);
        console.log(req.params.s3key);
        let query = {
            "album": {"contains": req.params.albumid},
            "s3key": {"contains": req.params.s3key}
        }

        Pictures.scan(query).exec((error, pictures) => {
            if (error) {
                console.log(error);
                res.send("Error happens");
            } else {
                console.log(pictures);
                let data_list = {};
                pictures.forEach(picture => {

                    let s3key = req.params.albumid + "/" + picture.s3key;

                    // Get signed image URL of S3.
                    let url = s3methods.getSignedUrl(process.env.MyPhotoBucket, s3key);

                    data_list["img"] = url;
                    data_list["title"] = picture.filename;
                    data_list["place"] = picture.place;

                })
                
                res.send(data_list);

            }
        })

    },
    uploadNewPicture: function(req, res, next) {

        try {

            // Transfer file to a buffer file.
            console.log("upload new picture to S3 and add meta data to DB");
            buf = Buffer.from(req.body.file.replace(/^data:image\/\w+;base64,/, ""),'base64');
            
            // Thumnail Generation.
            sharp(buf)
                .resize(200,200, {
                    // Preserving aspect ratio, resize the image to be as large as possible while ensuring its dimensions are less than or equal to both those specified.
                    fit: sharp.fit.inside,
                    // do not enlarge if the width or height are already less than the specified dimensions
                    withoutEnlargement: true
                })
                .toFormat('jpeg')
                .toBuffer()
                .then(function(outputBuffer){

                    // Upload Original image and it's thumbnail to S3.
                    s3methods.postimagetodirectory(req.body.loadfilename, buf, req.params.albumid).then((result)=>{
                        
                        thumnailFileName = "thumnail_" + req.body.loadfilename;

                        s3methods.postimagetodirectory(thumnailFileName, outputBuffer, req.params.albumid).then((result2) => {
                            
                            // Add meta information to DB
                            let databody = {};
                            databody['filename'] = req.body.filename;
                            databody['place'] = req.body.place;
                            databody['tags'] = req.body.tags;
                            databody['s3key'] = req.body.loadfilename;
                            databody['ThumnailKey'] = 'thumnail_' + req.body.loadfilename;
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
            
                    })

                })
        } catch (error) {
            console.error(error);
        }

    }
}