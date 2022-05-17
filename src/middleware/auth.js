const usermodel = require('../model/user')
const jwt = require('jsonwebtoken')

const auth = async (req,res,next)=> {
    try {
    
    const token = req.headers['authorization'].toString().replace('Bearer ','')
    const decodedtoken = jwt.verify(token,process.env.JWT_SECRET)
    const user = await usermodel.findOne({_id : decodedtoken._id,'tokens.token' : token})
    if(!user)
    {
       throw new Error()
    }
 
    req.token = token
    req.user = user
    next()
    
} catch (error) {
   res.status(401).send(error)       
}
}
module.exports = auth