const nodemailer = require('nodemailer');
const axios = require('axios');
const fs = require('fs');
const {MongoClient}=require('mongodb');
const {ObjectId}=require("mongodb")
const dot=require("dotenv").config()
const client=new MongoClient(process.env.DB_URI);


client.connect()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
client.db("spraks").collection("students").find().toArray().then((students)=>{
const transporter = nodemailer.createTransport({
  auth:{
    user:"vishaka@klu.ac.in",
    pass:"uakx ibmu kued nodl"
  },
  service:"gmail"
})

for (let i of  students){

  axios.get("https://api.qrserver.com/v1/create-qr-code/?data=" + encodeURIComponent('https://vishaka-server.onrender.com/qr/'+i._id) + '&size=200x200', { responseType: 'stream' }).then((res)=>{
    res.data.pipe(fs.createWriteStream(i._id + 'qrcode.png'));
    
  })
  i.image="https://vishaka-server.onrender.com/"+i._id+"qrcode.png"
//  transporter.sendMail({
//   from:"vishaka@klu.ac.in",
//   to:i.email,
//   subject:"Welcome to Splash2k25 - Your Invitation Awaits! 🎉",
//   html:`<!DOCTYPE html>
// <html>
//   <head>
//     <meta charset="UTF-8">
//     <title>Invitation to Splash2k25</title>
//   </head>
//   <body style="margin:0; padding:0; font-family: Arial, sans-serif; background: #f4f4f4;">
//     <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="padding:20px 0;">
//       <tr>
//         <td align="center">
//           <table width="600" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #e63e62, #fca23b); border-radius: 10px; color:#fff; text-align:center; padding:30px;">
            
//             <!-- Header -->
//             <tr>
//               <td style="font-size:22px; font-weight:bold; color:#FFD700; padding-bottom:10px;">
//                 INVITATION TO
//               </td>
//             </tr>

//             <!-- Title -->
//             <tr>
//               <td style="font-size:40px; font-weight:bold; color:#fff; padding-bottom:10px;">
//                 Splash2k25
//               </td>
//             </tr>

//             <!-- Subtitle -->
//             <tr>
//               <td style="font-size:18px; color:#FFE066; padding-bottom:20px;">
//                 You are cordially invited to our grand cultural fest
//               </td>
//             </tr>

//             <!-- QR Code -->
//             <tr>
//               <td>
//                 <img src="${i.image}" alt="QR Code" width="180" style="margin:20px auto; display:block; border-radius:8px; background:#fff; padding:10px;">
//               </td>
//             </tr>

//             <!-- Scan to enter -->
//             <tr>
//               <td style="font-size:18px; font-weight:bold; color:#fff; padding-bottom:20px;">
//                 SCAN TO ENTER
//               </td>
//             </tr>

//             <!-- Event Details -->
//             <tr>
//               <td style="font-size:16px; color:#fff; line-height:1.6; padding-bottom:20px;">
//                 <strong>Venue:</strong> Krishna Auditorium<br>
//                 <strong>Date:</strong> 07/09/2025<br>
//                 <strong>Time:</strong> 9:30 AM onwards
//               </td>
//             </tr>

//             <!-- Footer -->
//             <tr>
//               <td style="font-size:16px; color:#FFE066; padding-top:10px;">
//                 Come, celebrate culture, talent, and creativity with us!
//               </td>
//             </tr>

//           </table>
//         </td>
//       </tr>
//     </table>
//   </body>
// </html>
// `
// }).then((res)=>console.log(res)).catch(err=>console.log(err))
}
})
