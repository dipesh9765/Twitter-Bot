// Adding Dependencies
var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");


// add and intiate MessageBird SDK
var messagebird = require('messagebird')('R3hYzuZbXAQ4y3o29fpy3xqpv');
//this API has to be fetched from messagebird dashboard after signup (but has limited request).

// set up express framework

var app = express();
app.engine('handlebars',exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({ extended: true }));

// display page to ask phone num
app.get('/', function (req, res) {
    res.render('step1');
});

// phone num submission
app.post('/step2', function (req, res) {
    var number = req.body.number;
    // make req to verify token
    messagebird.verify.create(number, {
        templete: "Your verification code is %token."
    }, function (err, response) {
        if (err) {
            // request has failed
            console.log(err);
            res.render('step1', {
                error: err.errors[0].description
            });

        } else {
            // sucessful request
            console.log(response);
            res.render('step2', {
                id: response.id
            });
        }
    });
});

// verify whether token is correct?

app.post('/step3', function (req, res) {
    var id = req.body.id;
    var token = req.body.token;
    messagebird.verify.verify(id, token, function (err, response) {
        if (err) {
            res.render('step2',
                {
                    error: err.errors[0].description,
                    id: id
                });

        } else {
            // verification succesfull
            res.render('step3');
        }
    });
});

// Start app
app.listen(8080);