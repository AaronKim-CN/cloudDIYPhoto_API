const express = require('express')
var router = express.Router();

const AWS = require('aws-sdk')

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESSKEY,
    secretAccessKey: process.env.AWS_SECRETKEY
});

let s3 = new AWS.S3();

// 配列arrayからランダムに1個の要素を取り出す
function randomSelect(array, num)
{
  let newArray = [];
  
  while(newArray.length < num && array.length > 0)
  {
    // 配列からランダムな要素を選ぶ
    const rand = Math.floor(Math.random() * array.length);
    // 選んだ要素を別の配列に登録する
    newArray.push(array[rand]);
    // もとの配列からは削除する
    array.splice(rand, 1);
  }
  
  return newArray;
}

async function getImage(item){
    const data = s3.getObject(
        {
            Bucket: process.env.MyPhotoBucket,
            Key: item
        }
    ).promise();
    return data
}

function encode(data){
    let buf = Buffer.from(data);
    let base64 = buf.toString('base64');
    return base64
}

async function getoneImage(albumid){

    var params = {
        Bucket: process.env.MyPhotoBucket,
        Delimiter: '/',
        Prefix: albumid + "/"
    }

    const url = await s3.listObjectsV2(params).promise().then(data => {
        
        if (data.Contents != []){
            let obj1 = randomSelect(data.Contents,1)

            const signedUrlExpireSeconds = 60 * 5
            const url = s3.getSignedUrl('getObject', {
                Bucket: process.env.MyPhotoBucket,
                Key: obj1[0].Key,
                Expires: signedUrlExpireSeconds
            })

            return url
        } else {
            return null
        }
        
    });

    return url

}

router
    .get('/', function(req, res, next) {
        res.send("roottttt");
    })
    .get('/:albumid', function(req, res, next) {
        //console.log(req.params.albumid);
        getoneImage(req.params.albumid).then((url)=>{
            //res.send(url);
            res.redirect(url);
        })
        
    });    

module.exports = router;