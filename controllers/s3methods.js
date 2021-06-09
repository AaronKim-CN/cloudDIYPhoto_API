const AWS = require('aws-sdk')

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESSKEY,
    secretAccessKey: process.env.AWS_SECRETKEY
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

module.exports = { createDicrectory }