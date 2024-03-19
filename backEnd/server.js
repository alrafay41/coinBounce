const express = require("express");
const dbConnect = require("./database/index");
const app = express();
const port = 5000;

dbConnect();

app.get("/", (req, res) => {
  res.json({ msg: "hello world" });
});

app.listen(port, console.log(`backend is running on port:${port}`));
