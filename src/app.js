const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) =>{

    //console.log(req.body);
    try{
        validateSignUpData(req);
        const {firstName, lastName, email, password} = req.body;
        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
        });
         await user.save();
         res.send("User added successfully");
    }catch(err){
        res.status(400).send("Error while adding user" + err.message);
    }
    
});

app.post("/login", async (req, res) => {
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email:email});
        if(!user){
            throw new Error("Email id is not found");
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(isPasswordValid){
            res.send("login successful!!")
        }else{
            throw new Error("password is not matching");
        }
    }catch(err){
        res.status(400).send("ERROR : " + err.message);
    }
})

app.get("/user", async (req, res) => {
    const userEmail = req.body.email;
    try{
        const user = await User.find({email : userEmail});
        if(user.length === 0){
            res.status(404).send("User not found");
        }else{
            res.send(user);
        }
        
    }catch(err){
        res.status(400).send("Error while fetching user" + err.message);
    }
})

app.get("/feed", async (req, res) => {
   
    try{
       const users = await User.find();
       res.send(users);
    }catch(err){
        res.status(400).send("Error while fetching user" + err.message);
    }

});

app.delete("/delete", async(req, res) => {
    const userId = req.body.userId;
    try{
       const user = await User.findByIdAndDelete(userId);
       res.send("user deleted successfully");

    }catch(err){
       res.status(400).send("Error in deleting user" + err.message);
    }
})

app.patch("/update/:userId", async (req, res) =>{
    const userId = req.params?.userId;
    const data = req.body;

    
    try{
        const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
        const isUpdateAllowed = Object.keys(data).every((update) => ALLOWED_UPDATES.includes(update));
        if(!isUpdateAllowed){
           throw new Error("Invalid updates! Only photoUrl, about, gender, age and skills can be updated");

        }
        if(data?.skills.length > 10){
            throw new Error("Skills cannot be more than 10");
        }
        const user = await User.findByIdAndUpdate({_id:userId},data,{
            runValidators:true,
        });
        res.send("user updated successfully");
    }catch(err){
        res.status(400).send("Error in updating user" + err.message);
    }
})

connectDB()
    .then(() => {
        console.log('MongoDB connected successfully');
        app.listen(7777, ()=>{
            console.log("server is successfully listening on port 3000");
        });
    })
    .catch((err) => {
        console.error("Database cannot be connected to the server");
    });

