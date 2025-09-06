const {MongoClient}=require('mongodb');
const {ObjectId}=require("mongodb")
const dot=require("dotenv").config()
const client=new MongoClient(process.env.DB_URI);
const express=require("express");
const { default: axios } = require('axios');
const app=express();
const cors=require("cors")
client.connect()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
const students =client.db("spraks").collection("students")
app.use(express.json())
app.use(express.static("./"))
app.use(cors({origin:"*"}))

app.get("/",(req,res)=>{
  res.send("Hello World")
})
app.get("/qr/:id",async (req,res)=>{
  const student=await students.findOne({_id:new ObjectId(req.params.id)})
  
  if(!student){
    return res.status(404).send("Student not found")
  }
  if(student.readmit){
    return   res.json({...student,status:"admitted"})
  }
  if(student.exit_time){
    return   res.json({...student,status:"exited"})
  }
  if(student.entred){
    return   res.json({...student,status:"admitted"})

  }
  res.json({...student,status:"verified"})
})
app.post("/admit/:id",async (req,res)=>{
  const {time,readmit}=req.body
  const student=await students.findOne({_id:new ObjectId(req.params.id)})
  if(!student){
    return res.status(404).send("Student not found")
  }
  await students.updateOne({_id:new ObjectId(req.params.id)},{$set:{entred:true,entrey_time:time,readmit}})
  axios.post("https://script.google.com/macros/s/AKfycbzdydJPV2obiLiz3fUKj3fccRjLbYtD6Ip1Tj3N0uJcN8rxFpHCW0KXoarY0jZfO4I/exec",{...student,entred:true}).then(res=>console.log(res.data)).catch(err=>console.log(err))
  res.json({...student,status:"admitted"})
})
app.post("/exit/:id",async (req,res)=>{
  const {time}=req.body
  const student=await students.findOne({_id:new ObjectId(req.params.id)})
  if(!student){
    return res.status(404).send("Student not found")
  }
  await students.updateOne({_id:new ObjectId(req.params.id)},{$set:{exit_time:time}})
  axios.post("https://script.google.com/macros/s/AKfycbzdydJPV2obiLiz3fUKj3fccRjLbYtD6Ip1Tj3N0uJcN8rxFpHCW0KXoarY0jZfO4I/exec",{...student,entred:false}).then(res=>console.log(res.data)).catch(err=>console.log(err))
  res.json({...student,status:"exited"})
})
app.get("/all",async (req,res)=>{
    const allStudents=await students.find().toArray();
    res.send(allStudents);
})
app.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});
