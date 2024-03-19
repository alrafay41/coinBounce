const express = require("express");
const dbConnect = require("./database/index");
const errorHandler = require("./middlewares/errorHandler");
const router = require("./routes/index");
const app = express();
const port = 5000;

dbConnect();

// app.get("/", (req, res) => {
//   res.json({ msg: "hello world" });
// });
app.use(express.json());
app.use(router);
app.use(errorHandler);

app.listen(port, console.log(`backend is running on port:${port}`));
