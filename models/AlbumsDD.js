const dynamoose = require("dynamoose");

const albumDB = process.env.TABLE_CLOUDPHOTO_ALBUMS;

const AlbumsSchema = new dynamoose.Schema({
    "albumid": String,
    "displayname": String,
    "discription": String,
    "createDate": Date
}, {
    "saveUnknown": true,
    "timestamps": true
});

module.exports = dynamoose.model(albumDB, AlbumsSchema);