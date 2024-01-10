const express = require("express")
const { connection } = require("./config/db")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const { UserModel } = require("./models/User.model")
const { formRouter } = require("./routes/formRoute")
const { authentication } = require("./middlewares/authentication")
const cors = require("cors")

const app = express()
app.use(express.json())

/* const corsOptions = {
    origin: 'https://kryzen-project-frontend.netlify.app',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
}; */
app.use(cors({
    origin : '*'
}));

app.use('/uploads', express.static('uploads'))

app.get("/", (req, res)=>{
    res.status(200).send("BASE API")
})

app.post("/signup", async (req, res)=>{
    let {username, password} = req.body;

    let person = await UserModel.findOne({username})
    if(person){
        res.status(400).send({msg : "Username Already Exists"})
    }
    else{
        bcrypt.hash(password, 3, async (err, hash)=>{
            if(err){
                res.status(500).send({msg : "Something went wrong. Please try again!"})
            }
            else{
                const new_user = new UserModel({
                    username,
                    password : hash
                })
                try {
                    await new_user.save()
                    res.status(200).send({msg : "SignUp Successfull"})
                } catch (error) {
                    res.status(500).send({msg : "Something went wrong. Please try again!"})
                }
            }
        })
    }
})

app.post("/login", async (req, res)=>{
    const {username, password} = req.body

    const user = await UserModel.findOne({username})
    if(!user){
        res.status(400).send({msg : "User not found. Please signup first!"})
    }
    else{
        const hashed_password = user.password
        bcrypt.compare(password, hashed_password, (err, result)=>{
            if(result){
                let token = jwt.sign({user_id : user._id}, process.env.SECRET_KEY)
                res.status(200).send({msg : "Login Successful", token : token})
            }else{
                res.status(400).send({msg : "Login failed. Please try again!"}) 
            }
        }) 
    }
})

app.use("/form",authentication ,formRouter)

app.listen(8000, async ()=>{
    try {
        await connection
        console.log("Listening to port 8000")
        console.log("Connected to DB successfully")
    } catch (error) {
        console.log(error)
    }
})