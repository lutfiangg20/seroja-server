const { MongoClient } = require("mongodb");
const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],
    maxAge: 24 * 60 * 60 * 100,
  })
);

// Replace the uri string with your connection string.
const uri = "mongodb://localhost:27017";
const dbName = "seroja";

const client = new MongoClient(uri);
// Get the database
const db = client.db(dbName);
// Get the collection
const pelanggan = db.collection("pelanggan");
const barang = db.collection("barang");
const kategori = db.collection("kategori");
const laporan = db.collection("laporan");
const user = db.collection("user");
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

app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    /* const user = new user({ username, password: hashedPassword }); */
    const result = await user.insertOne({
      username: username,
      password: hashedPassword,
    });
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user" });
  }
});

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Missing token" });
  }

  try {
    const decoded = jwt.verify(token, "secretkey"); // Change 'secret' to your actual secret
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const usercek = await user.findOne({ username: username });
    if (!usercek) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    const isPasswordMatch = await bcrypt.compare(password, usercek.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    const token = jwt.sign({ username }, "secretkey");
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/logout", (req, res) => {
  // Clear the JWT token stored on the client-side (e.g., localStorage)
  // You may also want to handle clearing cookies if you're using them
  res.clearCookie("jwt_token"); // Example for clearing cookies
  res.status(200).json({ message: "Logout successful" });
});

app.get("/barang", verifyToken, async (req, res) => {
  try {
    // Find all documents
    const result = await barang.find({}).toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/barang", verifyToken, async (req, res) => {
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

app.get("/pelanggan", verifyToken, async (req, res) => {
  try {
    // Find all documents
    const result = await pelanggan.find({}).toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/pelanggan", verifyToken, async (req, res) => {
  try {
    // Create a document to insert
    const doc = req.body;
    // Insert the defined document into the "haiku" collection
    const result = await pelanggan.insertOne(doc);
    // Print the ID of the inserted document
    console.log(`A document was inserted with the _id: ${result.insertedId}`);
    return res.send("Pelanggan berhasil ditambahkan");
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
});

app.put("/barang/:id", verifyToken, (req, res) => {
  return res.send(
    `PUT HTTP method on product/${req.params.productId} resource`
  );
});

app.delete("/barang/:id", verifyToken, async (req, res) => {
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

app.get("/kategori", verifyToken, async (req, res) => {
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

app.post("/kategori", verifyToken, async (req, res) => {
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

app.delete("/kategori/:id", verifyToken, async (req, res) => {
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

app.get("/laporan", verifyToken, async (req, res) => {
  try {
    // Find all documents
    const result = await laporan.find({}).toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/laporan", verifyToken, async (req, res) => {
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

app.post("/update/stok", verifyToken, async (req, res) => {
  try {
    // Create a document to insert
    const { nama_barang, qty } = req.body;
    const collection = db.collection("barang");
    const result = await collection.updateMany(
      { nama_barang: nama_barang },
      { $set: { stok: parseInt(qty) } }
    );
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
