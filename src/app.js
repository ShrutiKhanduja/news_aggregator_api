const express = require('express');
const bodyParser = require('body-parser');

const routes = require('express').Router();
const newsInfo=require("./routes/newsRoutes")

const mongoose = require("mongoose");
const {signin, signup} = require("./controllers/authController");
require("dotenv")
  .config();

process.on('unhandledRejection', error => {
  console.log('unhandledRejection', error.message);
});


//Connect to database
  try {
    mongoose.connect("mongodb+srv://ShrutiKhanduja:2LaAP1JuvbUFOWdO@cluster0.ivus423.mongodb.net/", {
      useUnifiedTopology: true,
      useNewUrlParser: true
    });
    console.log("connected to db");
  } catch (error) {
    console.log(error);
    //handleError(error);
  }


const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(routes);

routes.use(bodyParser.urlencoded({ extended: false }));
routes.use(bodyParser.json());

const PORT = 4000;

routes.get('/', (req, res)=>{
  res.status(200).send("Welcome to the news aggregator app");
});



routes.post('/register', signup);

routes.post('/login', signin);
routes.use('/news',newsInfo);

app.listen(process.env.PORT || PORT, (error) =>{
  if(!error)
      console.log("Server is Successfully Running and App is listening on port " + PORT);
  else
      console.log("Error occurred, server can't start", error);
  }
);

module.exports = app;