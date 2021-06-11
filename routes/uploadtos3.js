const express = require('express')
var router = express.Router();

var multer  = require('multer');
var upload = multer({ 
    dest: 'uploads/', 
    limits: {
        fieldSize: 25 * 1024 * 1024 
    }
})

const AWS = require('aws-sdk')

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESSKEY,
    secretAccessKey: process.env.AWS_SECRETKEY
});

let s3 = new AWS.S3();


async function postimage(filename, fileContent){
    // Setting up S3 upload parameters
    const params = {
        Bucket: process.env.MyPhotoBucket,
        Key: filename,
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

async function postimagetodirectory(filename, fileContent, albumid){

    var s3key = albumid + '/' + filename;
    
    // Setting up S3 upload parameters
    const params = {
        Bucket: process.env.MyPhotoBucket,
        Key: s3key,
        ContentType: 'image/jpeg',
        ContentEncoding: 'base64', 
        Body: fileContent
    };

    // Uploading files to the bucket
    var s3response = await s3.putObject(params, function(err, data) {
        if (err) {
            console.log("error when upload file to s3");
            console.log(err);
            throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);
    }).promise();

    return s3response

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
        console.log(req.body.filename);
        //var newstring = req.body.file.slice(23);
        buf = Buffer.from(req.body.file.replace(/^data:image\/\w+;base64,/, ""),'base64');
        console.log(buf);
        postimage(req.body.filename, buf).then((result)=>{
            res.send("successed!!");
        })
    })
    .post('/:albumid', upload.single('formtest'), function(req, res, next) {
        console.log(res);
        console.log(req.params.albumid);
        console.log("why / disapper");
        res.send("okkkkk");
        buf = Buffer.from(req.body.file.replace(/^data:image\/\w+;base64,/, ""),'base64');

        postimagetodirectory(req.body.filename, buf, req.params.albumid).then((result)=>{
            console.log(result);
        })

        // getoneImage(req.params.albumid).then((url)=>{
        //     //res.send(url);
        //     res.redirect(url);
        // })
        
    });    

module.exports = router;