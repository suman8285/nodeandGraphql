var express = require("express");
var router = express.Router();

router.get('/',function(req,res){
    //res.send('working')
    //res.render('_layouts/header');
    res.render('index');
})

//exports
module.exports = router
