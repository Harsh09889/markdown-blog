const express = require("express");
const connectDb = require("./db/db_connection");
const articleRouter = require("./routes/article");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(express.json());
const PORT = process.env.SERVER_PORT;

app.use("/articles", articleRouter);

app.use("/", (err, req, res, next) => {
	console.log(err.message);
	res.status(500).send("Internal Server Error");
});

app.listen(PORT, () => {
	console.log("Server listening at", PORT);
	connectDb("md_blogs");
});
