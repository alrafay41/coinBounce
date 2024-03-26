const express = require("express");
const dbConnect = require("./database/index");
const errorHandler = require("./middlewares/errorHandler");
const router = require("./routes/index");
const cookieParser = require("cookie-parser");
const app = express();
const port = 5000;

dbConnect();

// app.get("/", (req, res) => {
//   res.json({ msg: "hello world" });
// });
app.use(express.json());
app.use(cookieParser());
app.use(router);
app.use(errorHandler); // always use it at the end of the file

app.listen(port, console.log(`backend is running on port:${port}`));
