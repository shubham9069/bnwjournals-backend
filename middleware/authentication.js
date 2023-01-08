 const jwt = require('jsonwebtoken');
require('dotenv').config();

const authentication = async(req, res, next) =>{
   // client side use Bearer secret key  
    const authHeader = req.headers['authorization'];
    if(!authHeader) return res.status(501).json({message:"no token provided "})
    
    console.log(authHeader);
   const Atoken = authHeader.split(' ')[1];
   jwt.verify(
      Atoken,
      process.env.ACCESS_TOKEN_SECRET,
      (err,decoded)=>{
         
         if(err)return res.status(501).json({message:"token is not verify or expire "});
         req.userId=decoded.user_id;
         
         next();


      }

   )
    
}
   
    


module.exports = authentication;