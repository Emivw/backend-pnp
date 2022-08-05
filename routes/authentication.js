const jwt=require("jsonwebtoken")
const db = require("../lib/dbconn.js")

const auth=async(req,res,next)=>{

    try{
        const idToken=req.header('Authorization').replace('Bearer ','')
        const decoded=jwt.verify(idToken,process.env.SECRET_KEY)
        req.id=decoded.id
        const sql= "SELECT * from users where user_id= ?"
        db.query(sql,decoded.id,(err,result)=>{
            if(err){
              return res.status(400).send({
                msg:err})
            }
          
        return next();
        })
        
    }catch(e){
          res.status(401).send({error: "please authenticate."})
    }
}

module.exports=auth