var express = require('express');
var router = express.Router();
var Page = require('../models/page');
const joi = require('joi');

router.get('/', function (req, res, next) {
    debugger
   res.send('data tes');
  });

   /*
* POST to implemnt JOI validation
*/
router.post('/test-joi-validation', async (req, res, next) => {

    //const result = validateRequest(req.body);
    //console.log(result.error.details[0].message);
    try{
  
    }catch(err){
  
    }
    const {error} = await validateRequest(req.body);
  
  if(error){
    console.log('error occured');
    return;
  }
    var ids = req.body['id[]'];
  });
  
  function validateRequest(page){
    const schema = {
      title: joi.string().min(3).required()
  };
  
  return joi.validate(page,schema);
  }

  //exports
module.exports = router