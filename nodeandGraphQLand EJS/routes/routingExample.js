var express = require('express');
var router = express.Router();

 router.route('/testing3')
 .post(createUser)
 .get(getAllUsers);

 function getAllUsers(req, res, next){
    console.log('testing route getAllUsers'+ req)
    res.send('callback done second test done aditya');
}

function createUser(){
    console.log('testing route')
}
router.route('/users/:userId')
    .get(getOneUser)
    .put(updateUser)
    .delete(deleteUser);

    function getOneUser(req, res, next){
        console.log('testing route'+req.params.userId);
        res.send('callback done second test done :-'+req.params.userId);
    }

    function updateUser(){
        console.log('testing route')
    }

    function deleteUser(){
        console.log('testing route')
    }

// router.param('userId', getByIdUser);

// .get( (req, res, next)=>{
//     res.send('callback done')
// });



 

  //exports
  module.exports = router