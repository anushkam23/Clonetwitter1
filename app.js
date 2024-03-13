var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var db = require('./db_con.js');
var app = express();
var multer=require('multer');
var sendVerifyMail=require('./mail_send.js');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: "test123$#%" }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname+"/public"));

var storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"public/uploads/");
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+"-"+req.session.userid+"-"+ + file.originalname);
    },
});


// for login page
app.get('/', function (req, res) {
    var msg="";
    if(req.session.msg!="")
    msg=req.session.msg;
    res.render('login', {msg:msg});
});

//login ya login_submit
app.post('/login_submit', function (req, res) {
    const { email, pass } = req.body;
    var sql = "";
    if (isNaN(email))
        sql = "select * from user where email='" + email + "' and password='" + pass + "' and status=1 and softdelete=0";

    else
        sql = "select * from user where mobile=" + email + " and password='" + pass + "' and status=1 and softdelete=0";

    db.query(sql, function (err, result, fields) {
        if (err)
            throw err;
        if (result.length == 0)
            res.render('login', { msg: "username password did not matched" });
        else {
            req.session.userid = result[0].uid;
            req.session.un=result[0].username;
            res.redirect('/home');
        }
    });
});   //end of login submit app.post method


//signup
app.get("/signup", function(req, res){
    res.render("signup", { errmsg: "" });
});

app.post("/reg_submit", function(req, res){
    const { fname, mname, lname, email, password, cpass, dob, gender,username } = req.body;
    let sql_check = "";
    if (isNaN(email))
    sql_check="select email from user where email='"+email+"'";
    else
    sql_check = "select mobile from user where mobile="+ email;
db.query(sql_check,function(err,result,fields){
    if(err)
    throw err;
if(result.length==1){
    let errmsg="";
    if(isNaN(email))
    errmsg="Email already exists";
else
errmsg="Mobile number already exists";
res.render('signup',{errmsg:errmsg});   //check
}
else{
    //here we will write code to insert all fetched value from form
    let curdate= new Date();
    let month=curdate.getMonth()+1;
    let dor=curdate.getFullYear()+"-"+month+"-"+curdate.getDate();
    let sql="";
    if(isNaN(email))
    sql="insert into user(fname,mname,lname,email,password,dob,dor,gender,username)values(?,?,?,?,?,?,?,?,?)";
else
sql="insert into user(fname,mname,lname,email,password,dob,dor,gender,username)values(?,?,?,?,?,?,?,?,?)"

// let t=new Date();
// let m=t.getMonth()+1;

// let dor = t.getFullYear()+"-"+m+"-"+t.getDate();
//err,result,fields nikala h
db.query(sql,[fname,mname,lname,email,password,dob,dor,gender,username],function(err,result){
    if(err)
    throw err;

if(result.insertId>0){
    if(isNaN(email))
    sendVerifyMail(email);
    req.session.msg="Account created, Please check to verify mail";
    res.redirect('/');
}
else{
    res.render('signup',{errmsg:"Can not complete signup, try again"});
}
});
    
   
}
});
});

// app.get('/varifyemail',function(req,res){
// let email=req.query['email'];

// let sql_update="update user set status=1 where email=?";
// db.query(sql_update,[email],function(err,result){
//     if(err)
//       console.log(err);

//     if(result.affectedRows==1){
//         req.session.msg="email varified"
//     }
//     else{
//         req.session.msg="can not verify your email id kindly contact admin of website";
//         res.redirect('/');
//     }
// });
// });



// app.get('/home',function(req,res){
//     if(req.session.userid!=""){
//         let msg="";
//         if(req.session.msg!="")
//         msg=req.session.msg;



//     let sql ="select * from tweet inner join user on user.uid=tweet.uid where tweet.uid=? or tweet.uid in (select follow_id from user_follows where uid=?) or tweet.post like '%"+req.session.un+"%'";
//         res.render("home",{data:"user tweet will be displayed",msg:msg});
    
//         db.query(sql,[req.session.userid,req.session.userid],function(err,result,fields){
        
//             if(err)
//                throw err;

//             res.render('home',{result:result,msg:msg});
//     });
//     }

//     else{
//         req.session.msg="Please login first to view home page";
//         res.redirect('/');
//     } 
// });



app.get('/home', function(req, res) {
    if(req.session.userid !== "") {
        let msg = "";
        if(req.session.msg !== "")
            msg = req.session.msg;

        let sql = "SELECT * FROM tweet INNER JOIN user ON user.uid = tweet.uid WHERE tweet.uid = ? OR tweet.uid IN (SELECT follow_id FROM user_follows WHERE uid = ?) OR tweet.post LIKE '%"+req.session.un+"%' order by tweet.datetime desc";
        
        db.query(sql, [req.session.userid, req.session.userid, '%' + req.session.un + '%'], function(err, result, fields) {
            if(err)
                throw err;

            res.render('home', {result: result, msg: msg}); // Move this render inside the query callback
        });
    } else {
        req.session.msg = "Please login first to view home page";
        res.redirect('/');
    } 
});






app.get('/logout',function(req,res){
    req.session.userid="";
    res.redirect('/');
});

//editsubmit tha pehle
app.get('/editprofile',function(req,res){
     db.query("select * from user where uid = ?",[req.session.userid],function(err,result,fields){
if(err)
throw err;
if(result.length==1){
         res.render('editprofile',{msg:"",result:result});
}
else{
    res.redirect('/');
}
     });
});
app.post('/edit_profile_submit',function(req,res){
    const {fname,mname,lname,about} = req.body;
    let sqlupdate="update user set fname=?,mname=?,lname=?,about=? where uid=?";
    db.query(sqlupdate,[fname,mname,lname,about,req.session.userid],function(err,result){
if(result.affectedRows==1){
    req.session.msg="data updated";
    res.redirect('/home');
}
else{
    req.session.msg="can not update profile";
    res.redirect('/');
}
    });
});

// app.get('/followers',function(req,res){
//      let sql="select * from user where uid in (select uid from user_follows where follow_uid=?)";
// });

// db.query(sql[req.session.userid],function(err,result,fields){
//     if(err)
//       throw err;
//     res.render('followers_view',{result:result,msg:""});
// });


//follow id =Null
app.get('/followers', function(req, res){
    let sql = "select * from user where uid in (select uid from user_follows where follow_id=?)";
    db.query(sql, [req.session.userid], function(err, result, fields){
        if(err)
            throw err;
        res.render('followers_view', { result: result, msg: "" });
    });
});

app.get('/following', function(req, res){
    let sql = "select * from user where uid in (select follow_id from user_follows where uid=?)";
    
    db.query(sql, [req.session.userid], function(err, result, fields){
        if(err)
            throw err;
        res.render('following_view', { result: result, msg: "" });
    });
});


//whenever a file is uploaded it is first saved in temp folder of server and it is saved till the script is executing,so we have to move that file to our folder before it is get deleted  

var upload_detail = multer({storage:storage});

app.post('/tweet_submit',upload_detail.single('tweet_img'),function(req,res){
    const {post}=req.body;
    // console.log(req.file);
    // console.log(req.file.filename);

    var filename="";
    var mimetype="";

    try{
        filename=req.file.filename;
        mimetype=req.file.mimetype;
    }
    catch(err){
        console.log(err);
    }

    var d=new Date();
    var m=d.getMonth()+1;
    var ct=d.getFullYear()+"-"+m+"-"+d.getDate()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
    let sql="insert into tweet(uid,post,datetime,image_vdo_name,type) values(?,?,?,?,?)";
    db.query(sql,[req.session.userid,post,ct,filename,mimetype],function(err,result){
        if(err)
          throw err;
        if(result.insertId>0)
          req.session.msg="tweet done";
        else
          req.session.msg="can not tweet your post";
        res.redirect('/home');  
    });
});

app.get('/verifyemail',function(req,res){
    let email=req.query['email'];
    let sql_update="update user set status=1 where email=?";
    db.query(sql_update,[email],function(err,result){
        if(err)
        console.log(err);
        if(result.affectedRows==1){
            req.session.msg="Email verified now you can login with your password and email3";
            res.redirect('/'); //redirecting to login page
        }
        else{
          req.session.msg="Can not verify your email contact website admin";
          res.redirect('/');
        }
    });
});

app.listen(8081, () => { console.log("server running at localhost port no 8081") });



// mysql -u root -p









///////////////////enddddddddddddddddddddd




// let curdate=new Date();
// console.log("month:-"+curdate.getMonth()+curdate.getMonth()+cur)
// app.get('/editprofile',function(req,res){
//     db.query("select * from user where uid=?",[req.session.userid],function(err,result,fields){
//         if(result.length==1)
//         res.render('edit_profile_view',{msg:"",result:result});
//     else{
//         req.session.msg="no data found";
//         res.redirect('/');
//     }
//     });
// });

// // app.post('/edit_profile_submit',function(req,res){
// //     const {fname,mname,lname,about} = req.body;
// //     let sqlupdate = "update user set fname=?,mname=?,lname=?,about=? where uid=?";
// // });

// app.get('/home',(req,res)=>{
//     if(req.session.userid!=""){
//         let msg="";
//         if(req.session.msg!="")
//         msg=req.session.msg;
//     res.render("home",{data:"user tweet will be displayed",msg:msg});
//     }
//     else{

//     }
// })

// app.post('/edit_profile_submit',function(req,res){
//     const {fname,mname,lname,about} = req.body;
//     let sqlupdate="update user set fname=?,mname=?,lname=?,about=? where uid=?";
//     db.query(sqlupdate);
// })

// const upload_config=multer({storage:storage});
// app.post("/tweet_submit",upload_config.single("tweet_img"),function(req,res){
//     const {post}=req.body;
//     console.log(post);
//     console.log(req.file);
//     console.log(req.file.mimetype);
//     console.log(req.file.filename);
// });















