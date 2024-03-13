var mysql=require('mysql');
var db=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"twitter_one"
});
db.connect(function(err){
    if(err)
    throw err;
console.log("connection done");
})
module.exports=db;