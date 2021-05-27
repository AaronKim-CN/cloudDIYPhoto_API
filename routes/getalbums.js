const express = require('express')
var router = express.Router();

const AWS = require('aws-sdk')

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESSKEY,
    secretAccessKey: process.env.AWS_SECRETKEY
});

let s3 = new AWS.S3();

async function getAlbumNames(){

    var params = {
        Bucket: process.env.MyPhotoBucket,
        Delimiter: '/',
    }

    const data = await s3.listObjectsV2(params).promise().then(data => { return data })

    result = []
    data.CommonPrefixes.forEach(function(data){
        result.push(data.Prefix)
    })
    // {album_name:xxxx, imagedata:data}
    return result

}

async function getAlbumImages(albumid){

    var params = {
        Bucket: process.env.MyPhotoBucket,
        Delimiter: '/',
        Prefix: albumid + "/",
        MaxKeys: 50
    }

    const data = await s3.listObjectsV2(params).promise().then(data => {
    
        url_list = []

        if (data.Contents != []){

            data.Contents.forEach(obj => {

                skipkey = albumid + "/"
                if(obj.Key != skipkey){
                    console.log(skipkey)
                    console.log(obj.Key)

                    const signedUrlExpireSeconds = 60 * 5
                    const url = s3.getSignedUrl('getObject', {
                        Bucket: process.env.MyPhotoBucket,
                        Key: obj.Key,
                        Expires: signedUrlExpireSeconds
                    })
                    
                    const tmp = {}
                    tmp["img"] = url
                    tmp["title"] = "title"

                    url_list.push(tmp)
                }

            })           

        } else {
            return null
        }

        return url_list 
    })

    return data

}

router
    .get('/', function(req, res, next) {
        // Get all album Names on the Bucket
        getAlbumNames().then((data)=>{

            res.send(data)
            console.log(res)
        })

    })
    .get('/:albumid', function(req, res, next) {

        // Get all images in the album
        getAlbumImages(req.params.albumid).then((data)=>{
            console.log(data)
            res.send(data)
        })
    });

module.exports = router;