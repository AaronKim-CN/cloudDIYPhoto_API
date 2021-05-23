const express = require('express')
var router = express.Router();

const AWS = require('aws-sdk')

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESSKEY,
    secretAccessKey: process.env.AWS_SECRETKEY
});

let s3 = new AWS.S3();





module.exports = router;