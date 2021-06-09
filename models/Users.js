var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

const dbname = process.env.DB_NAME

module.exports = {

    getOneUser: function () {
        return new Promise ((resolve, reject) => {

            MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
                if (err) throw err;
                var dbo = db.db(dbname);

                dbo.collection("users").findOne({}, { projection: { _id: 0 } }, function(err, result) {

                    if ( err ) {
                        reject(err);
                    } else {
                        resolve(result);
                    }

                    console.log(result);
                    db.close();
                });
            });

        });
    },

    getAllUsers: function () {
        return new Promise ( (resolve, reject) => {
            MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {

                if (err) throw err;
                var dbo = db.db(dbname);

                dbo.collection("users").find({}, { projection: { _id: 0 } }).toArray(function(err, result) {
                    if ( err ) {
                        reject(err);
                    } else {
                        resolve(result);
                    }

                    console.log(result);
                    db.close();
                  });

            });

        })
    },

    getUsersByID: function (id) {
        return new Promise ( (resolve, reject) => {

            MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {

                if (err) throw err;
                var dbo = db.db(dbname);
                var query = {id: id};

                dbo.collection("users").find(query, { projection: { _id: 0 } }).toArray(function(err, result) {
                    if ( err ) {
                        reject(err);
                    } else {
                        resolve(result);
                    }

                    console.log(result);
                    db.close();
                  });

            });

        })
    }
}