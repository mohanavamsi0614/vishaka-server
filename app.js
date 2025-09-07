const {MongoClient}=require('mongodb');
const {ObjectId}=require("mongodb")
const dot=require("dotenv").config()
const client=new MongoClient(process.env.DB_URI);
const express=require("express");
const { default: axios } = require('axios');
const app=express();
const cors=require("cors")
const nodemailer=require("nodemailer")
const transporter = nodemailer.createTransport({
  auth:{
    user:"vishaka@klu.ac.in",
    pass:"uakx ibmu kued nodl"
  },
  service:"gmail"
})
const transporter2 = nodemailer.createTransport({
  auth:{
    user:"vishakaklu@gmail.com",
    pass:"pees ckpn kkyx uauy"
  },
  service:"gmail"
})




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
app.post("/email",async (req,res)=>{
  const {id}=req.body
  const student=await students.findOne({_id:new ObjectId(id)})
    student.image="https://vishaka-server.onrender.com/"+student._id+"qrcode.png"
 transporter.sendMail({
  from:"vishaka@klu.ac.in",
  to:student.email,
  subject:"Welcome to Splash2k25 - Your Invitation Awaits! 🎉",
  html:`<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Invitation to Splash2k25</title>
  </head>
  <body style="margin:0; padding:0; font-family: Arial, sans-serif; background: #f4f4f4;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="padding:20px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #e63e62, #fca23b); border-radius: 10px; color:#fff; text-align:center; padding:30px;">
            
            <!-- Header -->
            <tr>
              <td style="font-size:22px; font-weight:bold; color:#FFD700; padding-bottom:10px;">
                INVITATION TO
              </td>
            </tr>

            <!-- Title -->
            <tr>
              <td style="font-size:40px; font-weight:bold; color:#fff; padding-bottom:10px;">
                Splash2k25
              </td>
            </tr>

            <!-- Subtitle -->
            <tr>
              <td style="font-size:18px; color:#FFE066; padding-bottom:20px;">
                You are cordially invited to our grand cultural fest
              </td>
            </tr>

            <!-- QR Code -->
            <tr>
              <td>
                <img src="${student.image}" alt="QR Code" width="180" style="margin:20px auto; display:block; border-radius:8px; background:#fff; padding:10px;">
              </td>
            </tr>

            <!-- Scan to enter -->
            <tr>
              <td style="font-size:18px; font-weight:bold; color:#fff; padding-bottom:20px;">
                SCAN TO ENTER
              </td>
            </tr>

            <!-- Event Details -->
            <tr>
              <td style="font-size:16px; color:#fff; line-height:1.6; padding-bottom:20px;">
                <strong>Venue:</strong> Krishna Auditorium<br>
                <strong>Date:</strong> 07/09/2025<br>
                <strong>Time:</strong> 9:30 AM onwards
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="font-size:16px; color:#FFE066; padding-top:10px;">
                Come, celebrate culture, talent, and creativity with us!
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`
}).then((res)=>console.log(res)).catch(err=>console.log(err))
res.send("Email sent")
})

app.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});
