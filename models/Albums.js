var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AlbumsSchema = new Schema({
    albumid: String,
    displayname: String,
    discription: String,
    createDate: Date
});

module.exports = mongoose.model('Albums', AlbumsSchema);