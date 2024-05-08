const express = require("express");
const app = express();
const cors = require("cors");

const port = 5000;

// Use for development
app.use(cors());

// GET Requests
app.get("/test", (req, res) => {
  try {
    res.json({ user: { name: "Moritz" } });
  } catch (e) {
    console.log(e);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
