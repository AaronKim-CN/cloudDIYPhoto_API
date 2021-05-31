var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {
    console.log(req.body);
    if (req.body.username){
        if (req.body.username == 'admin'){
            if (req.body.password == '123'){
                res.send({
                    token: 'test123'
                });
            } else {
                res.send("Wrong password");
            } 
        } else {
            res.send({token2: 'sdfsfsd'});
        }

    } else {
        res.send("Something wrong");
    }
    
});

module.exports = router;