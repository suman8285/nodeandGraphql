const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');

var log = require('../logger');
const logger = log.getLogger('sendEmil.js');

var router = express.Router();

router.post('/sendmail',(req,res)=>{
console.log('inside he send mail ');
let user = req.body;
try{
sendMail(user,info => {
console.log("mail has been sent and the id is "+ info.messageId);
res.send(info);
});
} catch(err){
console.log('error is :-'+ err)
}
});

async function sendMail(user,callback){
    // create reuseable transporter object using default SMTP transport
    logger.debug("inside send mail method",user);
    let transporter = nodemailer.createTransport({
        host:"smtp.gmai.com",
        port:587,
        source:false, // true for port 465 for all others false
        auth:{
            user:"suman8285@gmail.com",
            pass:"sharath8285"
        }
    });

    let mailoptions = {
        from:'"suman testing "', // sender address
        to: user.email, // list of receivers
        subject: '" welcome part testing"', // subject line
        html: `<h1> hi ${user.name}</h1></br>
               <h4> thanks for trying it out</h4>`
    };

    //send mail wit defined transport object
    let info = await transporter.sendMail(mailoptions);
    callback(info);
}

 //exports
 module.exports = router;