const jwt = require("jsonwebtoken")
require("dotenv").config()

const authentication = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if(!token){
        res.status(400).send({msg : "Please Login first!"})
    }
    else{
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded)=>{
            if(err){
                res.status(400).send({msg : "Please login first!"})
            }
            else{
                req.user_id = decoded.user_id
                next()
            }
        })
    }
}

module.exports = {authentication}