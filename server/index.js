//my express server
const express = require("express");
const app = express();
const PORT = 5001;

app.get("/api", (req, res) => {
  res.json({ message: "Hello from the Blogify server!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
