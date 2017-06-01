var express = require('express')
var bodyParse = require('body-parser')
var mongoose = require('mongoose')

var shortUrl = require('./models/shortUrl');
var app = module.exports = express();
var port = process.env.PORT || 3000;
var options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
                replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } } };

//export MONGOLAB_URI = 'mongodb://neochong:test1234@ds143071.mlab.com:43071/fcc-project';
//var url = process.env.MONGOLAB_URI;

var url = 'mongodb://neochong:test1234@ds143071.mlab.com:43071/fcc-project';

mongoose.Promise = global.Promise;

mongoose.connect(url, options);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  // Wait for the database connection to establish, then start the app.
});


app.use(express.static(__dirname + '/public'));

app.get('/new/:target(*)', function(req,res) {
  var targetUrl = req.params.target;
  var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
  var regex = expression;

  if(regex.test(targetUrl) === true) {
    var short = Math.floor(Math.random() * 100000).toString();
    var data = new shortUrl(
      {
        originalUrl: targetUrl,
        shorterUrl: short
      }
    )

    data.save(function(err) {
      if(err) {
        return res.send('Error saving to database');
      }
    })
    return res.json(data)
  }
  return res.json({originalUrl: 'Invalid URL'})
})

app.get('/:forward', function(req,res) {
  var forwardUrl = req.params.forward;

  shortUrl.findOne({'shorterUrl': forwardUrl}, function(err,data) {
    if(err) return res.send('Error reaching site')

    var re = new RegExp('^(http|https)://', 'i');
    if(data.originalUrl != null) {
      var str = data.originalUrl;
    }

    if(re.test(str) === true) {
      res.redirect(301, data.originalUrl);
    } else {
      res.redirect(301, 'http://' + data.originalUrl);
    }
  })
})

app.listen(port, function() {
  console.log("Working on port 3000")
})
