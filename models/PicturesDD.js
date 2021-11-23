const dynamoose = require("dynamoose");

const picturesDB = process.env.TABLE_CLOUDPHOTO_PICTURES;

const PicturesSchema = new dynamoose.Schema({
    "masterkey": String,
    "filename": String,
    "album": String,
    "time": Date,
    "s3key": String,
    "ThumnailKey": String,
    "place": String,
    "tags": String
}, {
    "saveUnknown": true,
    "timestamps": true
});

module.exports = dynamoose.model(picturesDB, PicturesSchema);