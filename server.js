
import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import cors from 'cors'
import User from "./modules/User.js";
import bodyParser from "body-parser";

const app = express();
app.use(express.json())
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));



app.use(bodyParser.json());
dotenv.config();

app.post("/api/hosting", async(req,res) => {
    const {name, email, password} = req.body;
    const user = new User({name, email, password});
    try {
        const savedUser = await user.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.json(error.message);
    }
})


app.put("/api/hosting/:id", async(req,res) =>{
    const {id} = req.params;
    console.log(id)
    const {name, email, password} = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(id,{$set:{name, email, password}},{new:true});
        res.status(201).json(updatedUser);
    } catch (error) {
        res.json(error.message);
    }
    
});

app.delete('/api/hosting/:id', (req,res)=>{
    console.log(req.params.id);
    let deleteId = new mongoose.Types.ObjectId(req.params.id);
    mongoose.connection.collection('users').deleteOne({_id:deleteId});
    console.log('deleted');
   res.json("deleted");
})


app.get("/api/hosting/:id", async(req,res) =>{
    const {id} = req.params;
    try {
        const getId = await User.findById(id);
        res.json(getId);
    } catch (error) {
        console.log(error.message);
    }
})





const connect = async () =>{
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to the database'); 
    } catch (error) {
        const { status, message } = error;
        console.log(status,message);
    }
}

app.get('/api/hosting', async(req,res) =>{
    try {
        const savedUser = await User.find();
        res.status(202).json(savedUser);
        console.log(savedUser);
        
    } catch (error) {
        req.json(error.message);
    }
})

app.get('*', (req,res)=>{
    res.json("api not found");
})


app.listen(process.env.PORT, () => {
    connect();
    console.log(`Server is running on port ${process.env.PORT}`);
  });






  

  