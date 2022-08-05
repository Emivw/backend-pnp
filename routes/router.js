const express = require('express');
const router = express.Router();
const db = require('../lib/dbconn.js')
const auth = require('./authentication')
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken')

//register routes
router.post('/api/register',(req,res)=>{
    
    let{email, password, password_repeat, username}=req.body
    //creating user object
    const user={
      email,
      password,
      username
    }

    if(!username){
      return res.status(400).send({
        msg: 'username should not be empty'
      });
    }

    //validate user and the information provided by them
    if (!email || !validator.validate(email)) {
      return res.status(400).send({
        msg: 'Please enter valid email id'
      });
    }

    // password min 6 chars
    if (!password || password.length < 6) {
      return res.status(400).send({
        msg: 'Please enter a password with min. 6 chars'
      });
    }

    // password (repeat) does not match
    if (
      !password_repeat ||
      password != password_repeat
    ) {
      return res.status(400).send({
        msg: 'Both passwords must match'
      });
  
  }


    db.query(`SELECT * FROM users WHERE email=?`,email,(err, result) => {
         
        if(err){
            return res.status(400).send({
                msg:err
            })
        }
       
        //check whether username already exist or not
        if (result.length!==0) {
          return res.status(409).send({
            msg: 'This email is already in use!'
          });
        } 
          // username is available
          bcrypt.hash(password, 8).then((hash)=> {
            //set the password to hash value
            user.password=hash

          }).then(()=>{
            db.query("INSERT INTO users SET ?",user,(err,result)=>{
              if(err){
                  return res.status(400).send({
                      msg:err
                  })
              }

            
                
               db.query('SELECT * FROM users WHERE email=?',email,(err,result)=>{
                if(err){
                  return res.status(400).send({
                      msg:err
                  })
                }
                 
                 return res.status(201)
                  .send({
                      userdata:user,
                      msg:"successfully registered"
                    })
               })
       
          })
          })        
  });
})
router.post('/api/login', (req,res)=>{
    const {email,password}=req.body
    
    if(req.body.email.trim()===''||req.body.password.trim()===''){
        return res.status(400).send({msg:"email or password must not be empty"})
    
    }

    db.query("SELECT * FROM users WHERE email=?",email,(err,result)=>{

        if(err){
            return res.status(400).send({
                msg:err
            })
        }

        //check whether the user with that email exists or not
        if(result.length===0){
            return res.status(401).send({
                msg:'email or password is incorrect'
            })
            }

           //check password
           bcrypt.compare(password,result[0].password).then(isMatch=>{
               
              if(isMatch===false){
                  return res.status(401).send({
                    msg:"email or Password is incorrect"
                })
            }

             //generate token
             const token=jwt.sign({id:result[0].user_id.toString()},process.env.SECRET_KEY)   
               return res.status(200).send({
                msg:"logged in successfully",
                user:result[0],
                token
             })
          
          })

    })
})
router.get('/secret-route',auth, (req, res, next) => {
    console.log(req.id);
    res.send('This is the secret content. Only logged in users can see this!');
  });

module.exports=router;