// import file
const express = require("express");
const dotenv = require("dotenv");

const mongoose = require("mongoose");
const bodyParser = require('body-parser');

// security middleware import
const helmet = require("helmet");
const hpp = require("hpp");
const mongoSanitize = require("express-mongo-sanitize");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");

// router import
const userRouter = require("./src/router/userRouter");
const taskRouter = require("./src/router/taskRouter");

//
const app = express();
dotenv.config();


// app.use(express.json());

// security middleware implement
app.use(helmet());
app.use(hpp());
app.use(mongoSanitize());
app.use(cors());
app.use(xss());

app.use(express.json({limit:'50mb'}));
app.use(express.urlencoded({extended: true ,limit:'50mb'}));


// app.use(bodyParser.json());



// rate limit
const rateLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 3000 });
app.use(rateLimiter);

// databse connection
mongoose
  .connect(process.env.DATABASE_URL ||5000, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("database connection seccessful !"))
  .catch((err) => console.log("Databse connection faild!"));

// routing

app.use("/user", userRouter);
app.use("/task", taskRouter);

// undefined route
app.use("*", (req, res) => {
  res.status(404).json({
    message: "Not Found!",
  });
});

// default error handler
// default error handler

const errorHandler = (err, req, res, next) => {
  if (res.headerssent) {
    return next(err);
  }
  res.status(500).json({ error: err });
};

app.use(errorHandler);

// server listen

app.listen(process.env.PORT, () => {
  console.log(`server listening on port ${process.env.PORT}`);
});
