const express = require('express')
var router = express.Router();

var multer  = require('multer');
var upload = multer({ dest: 'uploads/' })

const AWS = require('aws-sdk')

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESSKEY,
    secretAccessKey: process.env.AWS_SECRETKEY
});

let s3 = new AWS.S3();


async function postimage(fileContent){
    // Setting up S3 upload parameters
    const params = {
        Bucket: process.env.MyPhotoBucket,
        Key: 'cat4.jpg',
        ContentType: 'image/jpeg',
        ContentEncoding: 'base64', 
        Body: fileContent
    };

    // Uploading files to the bucket
    s3.putObject(params, function(err, data) {
        if (err) {
            throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);
    });

} 

router
    .post('/', upload.single('formtest'), function(req, res, next) {
        console.log("aaaaaaaa")
        //めちゃくちゃハマった話。。。
        // console.log(req.file)
        // console.log(req.body.file)
        // upload(req, res, function(err) {
        //     console.log(req.body);
        //     console.log(req.files);
        // })
        
        //var newstring = req.body.file.slice(23);
        buf = Buffer.from(req.body.file.replace(/^data:image\/\w+;base64,/, ""),'base64');
        console.log(buf);
        postimage(buf).then((result)=>{
            res.send("successed!!");
        })
    })
    .post('/:albumid', function(req, res, next) {
        //console.log(req.params.albumid);
        getoneImage(req.params.albumid).then((url)=>{
            //res.send(url);
            res.redirect(url);
        })
        
    });    

module.exports = router;