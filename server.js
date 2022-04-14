const mongoose = require('mongoose');
const dotenv = require("dotenv");
const log = require("./utils/colorCli");

const app = require('./app');

dotenv.config({ path: "./config.env" }); // <- config file


//Set up default mongoose connection
const mongoDB = process.env.DATABASE.replace(
	"<password>",
	process.env.DATABASE_PASSWORD
);

mongoose
	.connect(mongoDB, {
		// <- Using mongoose connection
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("DB CONNECTION ESTABLISHED");
	});

const db = mongoose.connection; // <- Getting the default connection
//Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// starting server ->
const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
	console.log(`App running at port ${port}...`);
});
 