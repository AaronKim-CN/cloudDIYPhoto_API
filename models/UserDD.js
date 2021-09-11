const dynamoose = require("dynamoose");

const userDB = process.env.TABLE_CLOUDPHOTO_USER;

const UserSchema = new dynamoose.Schema({
    "userid": String,
    "email": String,
    "password": String,
    "role": String
}, {
    "saveUnknown": true,
    "timestamps": true
});

module.exports = dynamoose.model(userDB, UserSchema);