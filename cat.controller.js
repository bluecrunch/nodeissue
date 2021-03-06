const con = require("../config/DBConnections");
const auth = require("../config/auth");
const bcrypt = require('bcryptjs')
//import bcrypt from "bcryptjs";

var respo = new Object();

function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * 
charactersLength));
 }
 return result;
}

let getcats = async(req,res) => {
  respo = {}  
  let token = req.headers['authorization'];
    con.query('SELECT * FROM users_token ut WHERE token = ?',[token], function (error, results, fields) {
        try{
          if(results[0]["user_id"]){

            var sqlquery = "SELECT * FROM cats";
            if(req.params.catname){
              sqlquery = sqlquery+" WHERE cat_url = ?"
            }
            con.query(sqlquery,[req.params.catname], function (error, results, fields) {
              try{
                if(results.length>0){
                  respo["data"] = results;
                  respo["code"] = 200;
                  console.log(respo)
                  res.send(respo)                  
                } else {
                  console.log("Getting list of cats failed")
                  respo["error"] = {}
                  respo["error"]["message"] = "Getting list of cats failed";
                  respo["error"]["code"] = 402;
                  res.send(respo)                   
                } 
              }catch(err){
                console.log("No user found")
                respo["error"] = {}
                respo["error"]["message"] = "No user found";
                respo["error"]["code"] = 402;
                console.log(error)
                res.send(respo)   
              }
            }); 
          }
          else{
            console.log("nope")
          }  
        }catch(err){
          respo["error"] = {}
          respo["error"]["message"] = "No valid token";
          respo["error"]["code"] = 402;
          console.log("No valid Token")
          console.log(error)
          res.send(respo)
        }
    });     
};

let getUsercats = async(req,res) => {
  respo = {}  
  let token = req.headers['authorization'];
    con.query('SELECT * FROM users_token ut WHERE token = ?',[token], function (error, results, fields) {
        try{
          if(results[0]["user_id"]){
            var sqlquery = "SELECT * FROM user_cats us JOIN cats s ON s.cat_id = us.cat_id WHERE us.user_id = ? ";
            if(req.params.catname){
              sqlquery = sqlquery+"AND s.cat_url = ?"
            }
            con.query(sqlquery,[results[0]["user_id"],req.params.catname], function (error, results, fields) {
              try{
                if(results.length>0){
                  respo["data"] = results;
                  respo["code"] = 200;
                  console.log(respo)
                  res.send(respo)                  
                } else {
                  console.log("No user found")
                  respo["error"] = {}
                  respo["error"]["message"] = "No user found";
                  respo["error"]["code"] = 402;
                  res.send(respo)                   
                } 
              }catch(err){
                console.log("No user found")
                respo["error"] = {}
                respo["error"]["message"] = "No user found";
                respo["error"]["code"] = 402;
                console.log(error)
                res.send(respo)   
              }
            }); 
          }
          else{
            console.log("nope")
          }  
        }catch(err){
          respo["error"] = {}
          respo["error"]["message"] = "No valid token";
          respo["error"]["code"] = 402;
          console.log("No valid Token")
          console.log(error)
          res.send(respo)
        }
    });     
};
//if(results.length>0){
let postUsercat = async(req,res) => {
  respo = {}  
  let token = req.headers['authorization'];
    con.query('SELECT * FROM users_token ut WHERE token = ?',[token], function (error, results, fields) {
        try{
          if(results[0]["user_id"]){
            console.log("token valid "+req.body.cat_id)
            con.query('SELECT * FROM user_cats WHERE user_id = ? AND cat_id = ?',[results[0]["user_id"],req.body.cat_id], function (error, resultcatCheck, fields) {
              console.log("you are here")
              try{
                if(resultcatCheck.length==0){
                  console.log("you here")
                  var randstr = makeid(10)
                  con.query('INSERT INTO user_cats (user_id, cat_id,unique_key) VALUES(?,?,?)',[results[0]["user_id"],req.body.cat_id,randstr], function (error, resultPost, fields) {
                    if(error){
                      console.log("No user found")
                      respo["error"] = {}
                      respo["error"]["message"] = "No user found. Result length too short";
                      respo["error"]["code"] = 402;
                      res.send(respo)                   
                    }
                    else{
                      console.log(resultPost.affectedRows + " record(s) updated");  
                      respo["data"] = resultPost;
                      respo["code"] = 200;
                      console.log(respo)
                      res.send(respo)                   
                    }
                  }); 
                }
                else{
                  respo["message"] = "cat already in list";
                  respo["code"] = 200;
                  console.log(respo)
                  res.send(respo)                       
                }
              }
              catch(error){
                console.log("No user found")
                respo["error"] = {}
                respo["error"]["message"] = "cat already in the list!";
                respo["error"]["code"] = 402;
                res.send(respo)        
              }
            });
          }
          else {
            console.log("error. No valid token.")
          }
        }catch(err){
          respo["error"] = {}
          respo["error"]["message"] = "No valid token";
          respo["error"]["code"] = 402;
          console.log("No valid Token")
          console.log(error)
          res.send(respo)
        }
    });     
};

let deleteUsercat = async(req,res) => {
  respo = {}  
  let token = req.headers['authorization'];
    con.query('SELECT * FROM users_token ut WHERE token = ?',[token], function (error, results, fields) {
        try{
          if(results[0]["user_id"]){
            console.log("token valid "+req.body.cat_id)
            con.query('SELECT * FROM user_cats WHERE user_id = ? AND cat_id = ? AND user_cats_id = ?',[results[0]["user_id"],req.body.cat_id,req.body.user_cats_id], function (error, resultcatCheck, fields) {
              console.log("you are here")
              try{
                if(resultcatCheck.length>0){
                  console.log("you here "+results[0]["user_id"]+" "+req.body.cat_id+" "+req.body.user_cats_id)
                  con.query('DELETE FROM user_cats WHERE user_id = ? AND cat_id = ? AND user_cats_id = ?',[results[0]["user_id"],req.body.cat_id,req.body.user_cats_id], function (error, resultPost, fields) {
                    if(error){
                      console.log("Can't delete cat")
                      respo["error"] = {}
                      respo["error"]["message"] = "Unable to delete cat: "+error;
                      respo["error"]["code"] = 402;
                      res.send(respo)                   
                    }
                    else{
                      console.log(resultPost.affectedRows + " record(s) updated");  
                      respo["data"] = resultPost;
                      respo["code"] = 200;
                      console.log(respo)
                      res.send(respo)                   
                    }
                  }); 
                }
                else{
                  respo["message"] = "Error finding cat.";
                  respo["code"] = 200;
                  console.log(respo)
                  res.send(respo)                       
                }
              }
              catch(error){
                console.log("No cat found")
                respo["error"] = {}
                respo["error"]["message"] = "cat not found!";
                respo["error"]["code"] = 402;
                res.send(respo)        
              }
            });
          }
          else {
            console.log("Error. No valid token.")
          }
        }catch(err){
          respo["error"] = {}
          respo["error"]["message"] = "No valid token";
          respo["error"]["code"] = 402;
          console.log("No valid Token")
          console.log(error)
          res.send(respo)
        }
    });     
};


let getGradeRequests = async(req,res) => {
  respo = {}  
  let token = req.headers['authorization'];
    con.query('SELECT * FROM users_token ut WHERE token = ?',[token], function (error, results, fields) {
        try{
          if(results[0]["user_id"]){
            con.query('SELECT usr.user_id_invitee,usr.user_id_inviter,usr.cat_id, u.first_name,u.last_name,s.name,s.category,u.email FROM users_cat_requests usr JOIN users u ON usr.user_id_inviter = u.user_id JOIN cats s ON usr.cat_id = s.cat_id WHERE usr.user_id_invitee = ? AND usr.active = 1 LIMIT 0,20',[results[0]["user_id"]], function (error, results, fields) {
              try{
                if(results.length>0){
                  respo["data"] = results;
                  respo["code"] = 200;
                  console.log(respo)
                  res.send(respo)                  
                } else {
                  console.log("No user found")
                  respo["error"] = {}
                  respo["error"]["message"] = "No user found";
                  respo["error"]["code"] = 402;
                  res.send(respo)                   
                } 
              }catch(err){
                console.log("No user found")
                respo["error"] = {}
                respo["error"]["message"] = "No user found";
                respo["error"]["code"] = 402;
                console.log(error)
                res.send(respo)   
              }
            }); 
          }
          else{
            console.log("nope")
          }  
        }catch(err){
          respo["error"] = {}
          respo["error"]["message"] = "No valid token";
          respo["error"]["code"] = 402;
          console.log("No valid Token")
          console.log(error)
          res.send(respo)
        }
    });     
};

let getGradeRequestB = async(req,res) => {
  respo = {}  
  let token = req.headers['authorization'];
    con.query('SELECT * FROM users_token ut WHERE token = ?',[token], function (error, results, fields) {
        try{
          if(results[0]["user_id"]){
            con.query('SELECT usr.user_id_invitee,usr.user_id_inviter,usr.cat_id, u.first_name,u.last_name,s.name,s.category,u.email FROM users_cat_requests usr JOIN users u ON usr.user_id_inviter = u.user_id JOIN cats s ON usr.cat_id = s.cat_id WHERE usr.user_id_invitee = ? AND usr.active = 1 LIMIT 0,20',[results[0]["user_id"]], function (error, results, fields) {
              try{
                if(results.length>0){
                  respo["data"] = results;
                  respo["code"] = 200;
                  console.log(respo)
                  res.send(respo)                  
                } else {
                  console.log("No user found")
                  respo["error"] = {}
                  respo["error"]["message"] = "No user found";
                  respo["error"]["code"] = 402;
                  res.send(respo)                   
                } 
              }catch(err){
                console.log("No user found")
                respo["error"] = {}
                respo["error"]["message"] = "No user found";
                respo["error"]["code"] = 402;
                console.log(error)
                res.send(respo)   
              }
            }); 
          }
          else{
            console.log("nope")
          }  
        }catch(err){
          respo["error"] = {}
          respo["error"]["message"] = "No valid token";
          respo["error"]["code"] = 402;
          console.log("No valid Token")
          console.log(error)
          res.send(respo)
        }
    });     
};

async function checkMail(email)  {
  query("SELECT * FROM users", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
  });
}

let postGradeRequest = async(req,res) => {
  console.log(checkMail(req.body.email));
};

module.exports = {getcats,getUsercats,postUsercat,deleteUsercat,getGradeRequests,postGradeRequest,checkMail}

