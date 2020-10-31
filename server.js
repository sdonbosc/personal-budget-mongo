//Budget API
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require("mongoose");
const port = process.env.PORT || 3000;
const PersonalBudget = require("./models/pb_schema")


var fs = require("fs");

let url = 'mongodb://localhost:27017/personalbudget';

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=>{
        console.log("Connected to the database via mongoose")
    })
    .catch((connectionError)=>{
        console.log(connectionError)
    });

app.use('/',express.static('public'));
app.use(cors());

////////////////
const path = require('path');

// imports body parser module
const bodyParser = require('body-parser');

// imports mongodb node driver & creates const for hosted mongo url
const MongoClient = require('mongodb').MongoClient;

// sets view folder
app.set('views', path.join(__dirname, 'views'));

// sets view engine
app.set('view engine', 'ejs');

// bodyParser middleware (returns POST requests as JSON)
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

// creates const for name of our database
const dbName = 'personalbudget';

// creates GET request route for index
app.get('/budgetdetails', (req, res) => {

  // opens connection to mongodb
  MongoClient.connect(url).then(client => {

    // creates const for our database
    const db = client.db(dbName);

    // creates const for 'personalbudget' collection in database
    const col = db.collection('personalbudget');

    // finds ALL personalbudget in 'personalbudget' collection/converts to array
    col.find({}).toArray().then(docs => {

      // logs message upon finding collection
      console.log('found personalbudget for index');

      res.send(docs);

      // closes connection to mongodb and logs message
      client.close(() => console.log('connection closed'));

    // checks for error in finding 'personalbudget' collection
    }).catch(err => {

      // logs message upon error in finding 'personalbudget' collection
      console.log('error finding personalbudget', err);

    });

  // checks for error in connecting to mongodb
  }).catch(err => {

    // logs message upon error connecting to mongodb
    console.log('error connecting to mongodb', err);

  });

});

app.get("/getAllBudgetDetails", (req, res) => {
  PersonalBudget.find().exec((err, data) => {
    if (err) {
        console.log("ERROR getAllBudgetDetails: ")
        return res.status(400).json({
            errors: err,
        });
    }
    console.log("SUCCESS getAllBudgetDetails: ", data)
    return res.json(data);
  });
});

//Code for adding a budget entry
app.post("/addMyBudget", (req, res) => {
  console.log("Adding new budget", req)
  const pbModel = new PersonalBudget({
      Exptype: req.body.Exptype,
      value: req.body.value,
      color: req.body.color,
  });
  pbModel.save().then((data) => {
      if (!data) {
      console.log("ERROR adding new budget: ")
      return res.status(400).json({
          errors: err,
      });
      }
      console.log("SUCCESS adding new budget: ")
      return res.json(data);
  });
});
// // creates GET request route for /personalbudget/add page and renders ejs template
// app.get('/personalbudget/add', (req, res) => res.render('personalbudget/add'));

// creates POST request route for /personalbudget/add page

// creates GET request route for /api/data page

app.listen(port, () => {
    console.log('Example API listening at http://localhost:${port}');
});