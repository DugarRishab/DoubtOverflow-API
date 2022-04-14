const express = require("express");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");
const rateLimit = require("ratelimit");
const hpp = require('hpp');

const app = express();

const AppError = require('./utils/appError');
const userRoutes = require('./routes/userRoutes');

app.enable("trust proxy");

app.use(cors());
app.options("*", cors());
app.use(helmet()); // <- Set security HTTP Headers

console.log(`ENV = ${process.env.NODE_ENV}`);
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

app.use((req, res, next) => {
	// <- Serves req time and cookies
	req.requestTime = new Date().toISOString();
	console.log(req.requestTime);
	if (req.cookies) console.log(req.cookies);

	next();
});

const limiter = rateLimit({
	max: 100,
	windowMs: 60 * 60 * 1000,
	message:
		"!!! Too many requests from this IP, Please try again in 1 hour !!!",
});

// app.use("/api", limiter); // <- Limit requests (Middleware)

app.use((req, res, next) => {
	res.setHeader("Content-Type", "application/json");
	next();
});

app.use(express.json({ limit: "10kb",  })); // <- Body Parser Midleware Functions 	// <- 'Limit' limits the amount of data comming in.
app.use(cookieParser()); // <- cookie parser Middleware Function
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use(mongoSanitize()); // <- Data Sanitization aganist NoSQL query Injection.
app.use(xss()); // <- Data Sanitization against xss

app.use(
	hpp({
		// <- Prevent Parameter Polution
		whitelist: [
			// <- whitelisted properties will not create error if defined more than once
			"duration",
			"ratingsQuantity",
			"ratingsAverage",
			"maxGroupSize",
			"price",
			"difficulty",
		],
	})
);

app.use(compression());

app.use('/api/v1/users', userRoutes);
app.all('*', (req, res, next) => {
	// <- Middleware to handle Non-existing Routes

	next(new AppError(`Cannot find ${req.originalUrl} on the server`, 404));
});

module.exports = app;
