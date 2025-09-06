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

    await sendInBatches(students.slice(64), 10, 60000); // batches of 5 every 60 sec
    console.log("✅ All emails attempted");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.close();
  }
}

async function sendInBatches(students, batchSize = 5, delay = 10000) {
  for (let i = 0; i < students.length; i += batchSize) {
    const batch = students.slice(i, i + batchSize);

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
