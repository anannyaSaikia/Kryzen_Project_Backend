const mongoose = require("mongoose")

const userDetailsSchema = new mongoose.Schema({
    name : {type : String, required : true},
    age : {type : Number, required : true},
    address : {type : String, required : true},
    image : {type : String, required : true},
    num_array : {type: [String]},
    user_id : {type : String}
})

const UserDetailsModel = mongoose.model("userdetails", userDetailsSchema)

module.exports = {UserDetailsModel}