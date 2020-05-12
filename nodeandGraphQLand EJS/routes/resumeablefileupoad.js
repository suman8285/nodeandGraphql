const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const fsextra = require('fs-extra');
const cors = require('cors');
var router = express.Router();

const app = express();
app.use(cors({origin:'*'}));
app.use(bodyParser.urlencoded({extended:true}));

let uploads = {};

router.get('/status',(req,res) =>{

    let fieldId = req.headers['x-file-id'];
    let name = req.headers['name'];
    let fileSize = parseInt(req.headers['size'],10);
    console.log("name:- "+name +"field Is is :- "+fieldId +"file size is :- "+fileSize);
    if(name){
        try {
            let stats = fs.statSync('/name' + name);
            if(stats.isFile()){
                console.log(`file size is ${fileSize} and already uploaded size is ${stats.size}`);
                if(fileSize == stats.size){
                    res.send({'status':'file is present'});
                    return;
                }
                if(!uploads[fieldId])
                uploads[fieldId] = {};
                console.log(uploads[fieldId]);
                uploads[fieldId]['bytesReceived'] = stats.size;
                console.log(uploads[fieldId],stats.size);
            }
        } catch (error) {
            
        }
    }
    let upload = uploads[fieldId];
    if(upload)
        res.send({"uploaded":upload.bytesReceived});
    else
        res.send({"uploaded": 0});
});

router.post('/upload',(req,res)=>{

    let fieldId = req.headers['x-file-id'];
    let name = req.headers['name'];
    let fileSize = parseInt(req.headers['size'],10);
    let startByte = parseInt(req.headers['x-start-byte'],10);

    if(uploads[fieldId] && fileSize == uploads[fieldId].bytesReceived){
        res.end();
        return;
    }
    console.log(fileSize);
    if(!fieldId){
        res.write(400,'no file id');
        res.end(400);
    }
    console.log(uploads[fieldId]);
    if(!uploads[fieldId]){
        uploads[fieldId] = {};
    }
    let upload = uploads[fieldId];
    let fileStream;
    if(!startByte){
        upload.bytesReceived = 0;
        let name = req.headers['name'];
        fileStream = fs.createWriteStream(`./name/${name}`,{
            flags:'W'
        });
    }else{
        if(upload.bytesReceived != startByte){
            res.writeHead(400,"wrong start byte");
            res.end(upload.bytesReceived);
            return;
        }
        // append to existing file
        fileStream = fs.createWriteStream(`./name/${name}`,{
            flags:'a'
        });
    }
    req.on('data',function(data){
        upload.bytesReceived += data.length;
    });
// send request body to file
req.pipe(fileStream);
// when request is finished and all the data has been written
fileStream.on('close',function(){
    console.log(upload.bytesReceived,fileSize);
    if(upload.bytesReceived == fileSize){
        console.log("upload finished");
        delete uploads[fieldId];

        res.send("file uploaded sucessfully");
        res.end();
    }else{
        console.log("file uploading failed at "+ upload.bytesReceived);
        res.write(500,"file error");
        res.end();
    }
});
    // in case of i/o error finisht the request
    fileStream.on('error',function(err){
        console.log("file strem error :"+ err);
        res.write(500,"file error");
        res.end();
    });
});

 //exports
 module.exports = router