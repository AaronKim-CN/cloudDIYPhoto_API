var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PicturesSchema =  new Schema({
    filename: String,
    album: String,
    time: Date,
    s3key: String,
    place: String,
    tags: Array
});

// Query Helper
PicturesSchema.query.searchall = function() {
    return this.where('filename').equals('test001');
}

module.exports = mongoose.model('Pictures', PicturesSchema);