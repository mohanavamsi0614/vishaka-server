const axios = require("axios");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const client = new MongoClient(process.env.DB_URI);

async function main() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const students = await client
      .db("spraks")
      .collection("students")
      .find()
      .toArray();

    console.log("Total students:", students.length);
  const emails = [
  "bandreameesha67@gmail.com",
  "gakapatipraneeth@gmail.com",
  "ganeshkatta2007@gmail.com",
  "sanjeevgopu205@gmail.com",
  "rishithasara143@gmail.com",
  "praha.yerram1325@gmail.com",
  "reddyosantosh@gmail.com",
  "pagolurohith13@gmail.com",
  "ruksanashaik021@gmail.com",
  "middechakri777@gmail.com",
  "babluvishnutej@gmail.com",
  "pathanamanulla6@gmail.com",
  "atlamadhav98@gmail.com",
  "rajesh11778383@gmail.com",
  "venkataraviteja777@gmail.com",
  "santoshponugoti24@gmail.com",
  "bhanupala644@gmail.com",
  "harshavardhanr54@gmail.com",
  "satishpanchadi6@gmail.com",
  "sikanthguvvalasrikanth@gmail.com",
  "kondachandra98@gmail.com",
  "itsrishiraj2006@gmail.com",
  "saidinesh.devarakonda@gmail.com",
  "rushindhareddy397@gmail.com",
  "putluripradeep@gmail.com",
  "imvaddevivek@gmail.com",
  "mohithdevkar9@gmail.com",
  "vikramsmiley8@gmail.com",
  "gandlasathwik1022@gmail.com",
  "ymanohar0963@gmail.com",
  "mukthapuramirfan@gmail.com",
  "Charantejabyri2007@gmail.com",
  "Vechhamsaiganesh@gmail.com",
  "kaif141130@gmail.com"
];


    await sendInBatches(students,emails, 10, 60000);
    console.log("✅ All emails attempted");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.close();
  }
}

async function sendInBatches(students,emails, batchSize = 5, delay = 10000) {
  for (let i = 0; i < emails.length; i += batchSize) {
    const batch = students.filter((s) => emails.includes(s.email)).slice(i, i + batchSize);
    // console.log(batch)
    
    await Promise.all(
      batch.map((s) =>
        axios
          .post("http://localhost:5000/email", { id: s._id })
          .then((res) =>
            console.log("✅ Sent to:", s.email, "-", res.data)
          )
          .catch((err) =>
            console.error("❌ Failed for:", s.email, "-", err.message)
          )
      )
    );

    console.log(`⏳ Waiting ${delay}ms before next batch...`);
    await new Promise((res) => setTimeout(res, delay));
  }
}

main();
