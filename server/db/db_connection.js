const mongoose = require("mongoose");

async function connectDb(db, uri = "mongodb://127.0.0.1:27017/") {
	try {
		await mongoose.connect(uri + db, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
	} catch (error) {
		console.log("Could not connect to DATABASE!!", error.message);
	}
}

mongoose.set("strictQuery", true);

mongoose.connection.on("connected", () => {
	console.log("Connected to the Database");
});

mongoose.connection.on("disconnected", () => {
	console.log("Disconnected from the Database");
});

module.exports = connectDb;
