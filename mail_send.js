//  nodemailer
var nodemailer=require('nodemailer');
async function sendVerifyMail(to_email){
let transporter=nodemailer.createTransport({
service:"gmail",
host:"smtp.gmail.com",
port:465,
secure:false,
auth:{
    user:"enter your email here",
    pass:"enter yout password here"
}
});

let info = await transporter.sendMail({
    to:to_email,
    from:"anushkam254@gmail.com",
    subject:"Verification email for twitter.",
    html: "<h2 style=\"color:red\">Please click on this link to verify email id</h2> <a href=\"http://localhost:8081/verifyemail?email=" + to_email + "\">Click here to verify email </a>"
});

if(info.messageId)
 return true;
else
 return false;
}
module.exports=sendVerifyMail;

