//  nodemailer
// 1. install a smtp server and configure it
// 2. we use some free server like gmail

var nodemailer=require('nodemailer');
async function sendVerifyMail(to_email){
let transporter=nodemailer.createTransport({
service:"gmail",
host:"smtp.gmail.com",
port:465,
secure:false,
auth:{
    user:"anushkam254@gmail.com",
    pass:"qktjaajvuyzspyly"
}
});

let info = await transporter.sendMail({
    to:to_email,
    from:"anushkam254@gmail.com",
    subject:"Verification email for twitter.",
    html: "<h2 style=\"color:red\">Please click on this link to verify email id</h2> <a href=\"http://localhost:8081/verifyemail?email=" + to_email + "\">Click here to verify email </a>"

    // html:"<h2 style=\"color:red\">Please click on this link to verify email id</h2> <a href=\"http://localhost:8081/verifyemail?email"+to_email+"\">Click here to verify email </a>"
});

// console.log(info);

if(info.messageId)
 return true;
else
 return false;
}
module.exports=sendVerifyMail;

// async function sendVerifyMail(to_email) {
//     let transporter = nodemailer.createTransport({
//         service: "gmail",
//         host: "smtp.gmail.com",
//         port: 465,
//         secure: true, // Set secure to true for port 465
//         auth: {
//             user: "anushkam254@gmail.com",
//             pass: "qktjaajvuyzspyly"
//         }
//     });

//     try {
//         let info = await transporter.sendMail({
//             to: to_email, // Specify the recipient email address
//             from: "anushkam254@gmail.com",
//             subject: "Verification email for Twitter",
//             html: `<h2 style="color:red">Please click on this link to verify email id</h2> <a href="http://localhost:8081/verifyemail?email=${to_email}">Click here to verify email </a>`
//         });

//         if (info.messageId) {
//             return true;
//         } else {
//             return false;
//         }
//     } catch (error) {
//         console.error("Error sending verification email:", error);
//         return false;
//     }
// }


// const nodemailer = require('nodemailer');

// async function sendVerifyMail(to_email) {
//     try {
//         // Create a nodemailer transporter
//         let transporter = nodemailer.createTransport({
//             service: "gmail",
//             host: "smtp.gmail.com",
//             port: 465,
//             secure: true,
//             auth: {
//                 user: "anushkam254@gmail.com",
//                 pass: "qktjaajvuyzspyly"
//             }
//         });

//         // Send mail with specified options
//         let info = await transporter.sendMail({
//             to: to_email,
//             from: "anushkam254@gmail.com",
//             subject: "Verification email for twitter.",
//             html: `<h2 style="color:red">Please click on this link to verify email id</h2> <a href="http://localhost:8081/verifyemail?email=${to_email}">Click here to verify email</a>`
//         });

//         // Log the info object
//         console.log("Email sent:", info);

//         // Check if the email was sent successfully
//         if (info.messageId) {
//             return true;
//         } else {
//             return false;
//         }
//     } catch (error) {
//         // Log any errors that occur during email sending
//         console.error("Error sending email:", error);
//         return false;
//     }
// }

// module.exports = sendVerifyMail;
