const express = require('express')
var router = express.Router();

const AWS = require('aws-sdk')

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESSKEY,
    secretAccessKey: process.env.AWS_SECRETKEY
});

let s3 = new AWS.S3();

// 配列arrayからランダムにnum個の要素を取り出す
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

async function get_random_10keys(commonPrefixes, num){

    let keys10 = get_all_keys(commonPrefixes).then((Promises)=>{

        let allkeys = []

        let p = Promise.all(Promises)
        .then(
            result => {
                
                result.forEach(function(data){
                    data.Contents.forEach(function(item, index){
                        if (item.Size != 0){
                            allkeys.push(item.Key)
                        }
                    })
                })

                let keys_10 = randomSelect(allkeys,num)

                return new Promise(function (resolve, reject) {
                    resolve(keys_10)
                })

            }
        )

        return p

    })

    return keys10

}

async function get_all_keys(commonPrefixes){
    var Promises = []
    // Loop all the folders
    commonPrefixes.forEach(function (item, index) {

        directory = item.Prefix;

        var params = {
            Bucket: process.env.MyPhotoBucket,
            Delimiter: '/',
            Prefix: directory
        }

        const keylistPromise = s3.listObjectsV2(params, function(err, data){
            contents = data.Contents
            contents.forEach(function(item, index){
                if (item.Size != 0){
                    //allkeys.push(item.Key)
                }
            }
            )

        }).promise();

        Promises.push(keylistPromise)

    });

    return Promises

}

async function getImagelist(){
    
    var params = {
        Bucket: process.env.MyPhotoBucket,
        Delimiter: '/',
    }

    const data = await s3.listObjectsV2(params).promise().then(data => { return data })
    
    let returnvalue = get_random_10keys(data.CommonPrefixes,10).then((keylist)=>{
        return keylist
    }).then(async (klist)=>{
        
        resultlist =  []
        for(let item of klist){
            // Get images
            await getImage(item).then((img)=> {
                let image = encode(img.Body)
                resultlist.push(image)
            })
            
        }
        return resultlist
    })

    return returnvalue

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

router.get('/', function(req, res, next) {

    getImagelist().then((imglist)=>{
        res.send(imglist)
    })

});

module.exports = router;
