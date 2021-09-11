const AWS = require('aws-sdk')

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESSKEY,
    secretAccessKey: process.env.AWS_SECRETKEY,
    region: process.env.REGION
});

let s3 = new AWS.S3();

async function createDicrectory(foldername){
    
    console.log(foldername);
    // Setting up S3 upload parameters
    const params = {
        Bucket: process.env.MyPhotoBucket,
        Key: foldername + '/'
    };

    // Create a folder in the S3 Bucket
    s3.putObject(params, function(err, data) {
        if (err) {
            throw err;
        }
        console.log(`Folder created successfully. ${data.Location}`);
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
            console.log("error happend when upload file to s3");
            console.log(err);
            throw err;
        }
        console.log(`File uploaded successfully. ${data}`);
    }).promise();

    return s3response

}

function getSignedUrl(bucketname, s3key) {

    const signedUrlExpireSeconds = 60 * 5;
    const url = s3.getSignedUrl('getObject', {
        Bucket: bucketname,
        Key: s3key,
        Expires: signedUrlExpireSeconds
    })

    return url
}

module.exports = { createDicrectory, postimagetodirectory, getSignedUrl }