const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();

app.use(express.json());

app.post("/signup", async (req, res) =>{

    console.log(req.body);

    const user = new User(req.body);
    try{
         await user.save();
         res.send("User added successfully");
    }catch(err){
        res.status(400).send("Error while adding user" + err.message);
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

