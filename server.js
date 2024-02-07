const { MongoClient } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.json());

// Replace the uri string with your connection string.
const uri = "mongodb://localhost:27017";
const dbName = "seroja";

const client = new MongoClient(uri);
// Get the database
const db = client.db(dbName);
// Get the collection
const barang = db.collection("barang");
const kategori = db.collection("kategori");
const laporan = db.collection("laporan");
const createdAt = new Date();

async function connectToMongo() {
  try {
    // Connect the client to the server
    await client.connect();
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}
connectToMongo();

app.get("/barang", async (req, res) => {
  try {
    // Find all documents
    const result = await barang.find({}).toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/barang", async (req, res) => {
  try {
    // Create a document to insert
    const doc = req.body;
    // Insert the defined document into the "haiku" collection
    const result = await barang.insertOne(doc);
    // Print the ID of the inserted document
    console.log(`A document was inserted with the _id: ${result.insertedId}`);
    return res.send("Barang berhasil disimpan");
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
});

app.put("/barang/:id", (req, res) => {
  return res.send(
    `PUT HTTP method on product/${req.params.productId} resource`
  );
});

app.delete("/barang/:id", async (req, res) => {
  try {
    // Mendapatkan ID dari parameter URL
    const id = req.params.id;

    // Menghapus data dari MongoDB berdasarkan ID
    const result = await barang.deleteOne({
      nama_barang: req.params.id,
    });

    // Memeriksa apakah data berhasil dihapus
    if (result.deletedCount === 1) {
      res.status(200).send("Data deleted successfully");
    } else {
      res.status(404).send("Data not found");
    }
  } catch (err) {
    // Menangani kesalahan
    console.error("Error deleting data from MongoDB:", err.message);
    res.status(500).send("Internal Server Error");
  }
  /* return res.send(
    `DELETE HTTP method on product/${req.params.productId} resource`
  ); */
});

app.get("/kategori", async (req, res) => {
  try {
    // Find all documents
    const result = await kategori.find({}).toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.post("/kategori", async (req, res) => {
  try {
    // Create a document to insert
    const doc = req.body;
    // Insert the defined document into the "haiku" collection
    const result = await kategori.insertOne(doc);
    // Print the ID of the inserted document
    console.log(`A document was inserted with the _id: ${result.insertedId}`);
    return res.send("Kategori berhasil disimpan");
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
});

app.delete("/kategori/:id", async (req, res) => {
  try {
    // Mendapatkan ID dari parameter URL
    const id = req.params.id;

    // Menghapus data dari MongoDB berdasarkan ID
    const result = await kategori.deleteOne({
      nama_kategori: req.params.id,
    });

    // Memeriksa apakah data berhasil dihapus
    if (result.deletedCount === 1) {
      res.status(200).send("Data deleted successfully");
    } else {
      res.status(404).send("Data not found");
    }
  } catch (err) {
    // Menangani kesalahan
    console.error("Error deleting data from MongoDB:", err.message);
    res.status(500).send("Internal Server Error");
  }
  /* return res.send(
      `DELETE HTTP method on product/${req.params.productId} resource`
    ); */
});

app.get("/laporan", async (req, res) => {
  try {
    // Find all documents
    const result = await laporan.find({}).toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/laporan", async (req, res) => {
  try {
    // Create a document to insert
    const data = req.body;
    const dataWithCreatedAt = data.map((item) => ({
      ...item,
      created_at: createdAt,
    }));
    // Insert the defined document into the "haiku" collection
    const result = await laporan.insertMany(dataWithCreatedAt);
    // Print the ID of the inserted document
    console.log(`A document was inserted with the _id: ${result.insertedId}`);
    return res.send("Kategori berhasil disimpan");
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
});

// Close the connection when the Node.js process is terminated
process.on("SIGINT", async () => {
  try {
    await client.close();
    console.log("MongoDB connection closed");
    process.exit(0);
  } catch (error) {
    console.error("Error closing MongoDB connection:", error);
    process.exit(1);
  }
});
