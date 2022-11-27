//jshint esversion: 6

// creating server with express => npm install express
const express = require("express");
// mailchimp api by installing package in hyper => npm install mailchimp-marketing
const mailchimp = require("mailchimp-marketing");

// for accessing html element => npm install body-parser
const bodyParser = require("body-parser");
// The request module is used to make HTTP calls. It is the simplest way of making HTTP calls in node. js using this request module.
// => npm install request
const request = require("request");

const https = require("https");

// to use express to lauch server
const app = express();

//to access local files like css, images, sound, video from local folder create public folder and put values in it.
app.use(express.static("public"));

// to tell program to use body parser so it can access html input element with Name
app.use(bodyParser.urlencoded({
  extended: true
}))

// adding mailchimp api key and server info
mailchimp.setConfig({
  apiKey: "",
  server: "",
});

// creting port for local and heroku hosting server
app.listen(process.env.PORT || 3000, function() {
  console.log("server live ...")
});

// to get html file on home page
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  // creating variable from html input names
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;

    // sending file to mailchimp server by creating object
    const addMembers = async () => {
      const response = await mailchimp.lists.addListMember("0eb56477bd", {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      });

      // success and failure page
      if(res.statusCode == 200){
        res.sendFile(__dirname + "/success.html");
      }else if(res.statusCode == 400){
        res.sendFile(__dirname + "/failure.html");
      }else{
      res.sendFile(__dirname + "/failure.html");
    }
    };

    // calling function
    addMembers();

  });


// to redirect failure button click to signup button
app.post("/failure", function(req, res){
  res.redirect("/");
})
