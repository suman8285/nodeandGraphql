var express = require('express');
var router = express.Router();
var feign = require('feignjs')
var feignRequest = require('feignjs-request');
var feignJQuery = require('feignjs-jquery');

var restDescription = {
    getUsers: 'GET /users',
    getUser: 'GET /users/{id}',
    getUserC: 'GET /users/{id}{?c}',
    createPost: 'POST /posts',
    modifyPost: 'PUT /posts/{id}',
    modifyUserPost: 'PUT /users/{userId}/posts/{postId}'
  };

  var client = feign.builder()
        .client(new feignJQuery({debug: false}))
        .requestInterceptor({apply:function(req){
          console.log(req.options.method, req.options.uri, "body:", req.parameters);
        }})
        .target(restDescription, 'http://jsonplaceholder.typicode.com');

       

        //GET
    router.get('/',  async (req, res, next)=> {
        console.log('inside the get');
        await  validateRequest();
        res.send('data test');
        });

          //GET
    router.get('/testing',  async (req, res, next)=> {
        console.log('inside the get');
          await validateRequest();
        res.send('data test');
        });

         //GET
         router.get('/testing2',  (req, res, next)=> {

            xyz();
           
            res.send('testing');
            });

        function xyz(){
            client.getUser(1, {c: 1})
            .then(function(r){
            console.log(r);
            })
        }

//same:
//client.getUser({id:1}, {c: 1})


async function validateRequest(){
    console.log(client,client.getUser);
        client.getUser(1, {c: 1})
        .then(function(r){
        console.log(r);
        return client.getUserC({c:1, id:1}, {e:6});
        }).then(function(r){
        console.log(r);
        return client.createPost({
            title: 'foo',
            body: 'bar',
            userId: 1
        });
        }).then(function(r){
        console.log(r);
        return client.modifyPost(1, [{
            id: 155,
            title: 'foo',
            body: 'bar',
            userId: 1
        }])
        }).then(function(r){
        console.log(r);
        return client.modifyUserPost({userId: 1, postId:1}, [{
            id: 1,
            title: 'foo',
            body: 'bar',
            userId: 1
        }]) 
        })
        .catch(console.error)
        .then(function(r){
        return client.modifyUserPost(1, 1, [{
            id: 1,
            title: 'foo',
            body: 'bar',
            userId: 1
        }]);
        })
        .catch(console.error);
}
 //exports
 module.exports = router