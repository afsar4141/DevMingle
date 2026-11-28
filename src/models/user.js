const mongoose = require('mongoose');
const validator = require('validator');
const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minlength:4,
        maxlength:50
    },
    lastName:{
        type:String,
        
    },
    email:{
        type:String,
        lowercase:true,
        trim:true,
        required:true,
        unique:true,
        validate(value){
           if(!validator.isEmail(value)){
            throw new Error("Email is invalid");
           } 
        }
    },
    password:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Password must be at least 8 characters long");
            }
        }
    },
    age:{
        type:Number,
        min:18,
        
    },
    gender:{
        type:String,
        validate(value){
            if(!["Male", "Female", "Other"].includes(value)){
                throw new Error("Gender must be male, female or other");
            }
        }
    },
    photoUrl:{
        type:String,
        default:"https://th.bing.com/th/id/R.60a385c914dac233ccf6a6009df09f00?rik=1bM%2fbphaz4zcKg&riu=http%3a%2f%2fwww.aza-e-hussain.org%2fimg%2fmembers%2fuserplaceholder.jpg&ehk=xUoLgVfEmeHt3BH7VhJKoLzGO66SigXLfpRSOuTbB7Y%3d&risl=&pid=ImgRaw&r=0",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Photo URL is invalid");
            }
        }
    },
    about:{
        type:String,
        default:"Hey there! I am using this app."
    },
    skills:{
        type:[String],
    }
},{timestamps:true});

const User = mongoose.model("User", userSchema);

module.exports = User;