/******************************************************************/

/*Author: aafaque */

/*****************************************************************/

const express = require('express')
const bodyParser= require('body-parser')
const MongoClient = require('mongodb').MongoClient
const app = express();

var formidable = require('formidable');
var fs = require('fs');
var https = require('https');

app.use("/public",express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({extended: true}))
app.use("/stylesheet",express.static(__dirname + "/stylesheet"));
app.use("/images",express.static(__dirname + "/images"));
app.use("/js",express.static(__dirname + "/js"));
app.set('view engine', 'ejs')

var db

MongoClient.connect('mongodb://localhost/Users', (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(8080, () => {
    console.log('listening on 8080')
  })

  app.get('/', (req, res) => {
    db.collection('users').find().toArray((err, result) => {
      if (err) return console.log(err)
      // renders index.ejs
      res.render('index', {users: result})
    })
  })

  app.post('/users1', (req, res) => {
    db.collection('users').save({
      "gender" : req.body.gender
    }, (err, result) => {
      if (err) return console.log(err)
      console.log(req.body);
      console.log('saved to database')
      res.redirect('/')
    })
  })

  app.post('/adduser', (req, res) => {
      res.redirect('/add')
  })

  app.get('/add', (req, res) => {
      res.render('add')
  })

  app.get('/edit?', (req, res) => {
    db.collection('users').find({name:req.query.user}).toArray((err, result) => {
      if (err) return console.log(err)
      // renders index.ejs
      console.log(req.query.user);
      res.render('edit', {users: result})
    })
  })


  app.post('/users', function(req, res) {
	console.log('doing save');

	var form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, files) {
		var newUrl = '/uploads/';
    var string = files.img.name;
    var arr = string.split(".");
    var ext = arr.pop();
    var imgnamewoext = arr.join(".");
    console.log("I am here");
    console.log(files.img.name);

    db.collection('users').save({
      "name" : fields.name,
      "pass" : fields.pass,
      "email" : fields.email ,
      "phone" : fields.phone,
      "age" : fields.age,
      "gender" : fields.gender ,
      "address1" : fields.address1,
      "address2" : fields.address2,
      "city" : fields.city,
      "state" : fields.state,
      "postal" : fields.postal,
      "country" : fields.country,
      "message" : fields.details ,
      "org_img" : files.img.name,
      "ed_img" : imgnamewoext + '_v1.png'
    }, (err, result) => {
      if (err) return console.log(err)
      console.log('saved to database')
    })

		if(fields.newImg !== '') {

			console.log('We need to download an image.');
      var string = files.img.name;
      var arr = string.split(".");
      var ext = arr.pop();
      var imgnamewoext = arr.join(".");
			var name = imgnamewoext + '_v1.png' ;
			var file = fs.createWriteStream('./public/uploads/'+name);
			var request = https.get(fields.newImg, function(response) {
				var stream = response.pipe(file);
				stream.on('finish', function() {
					newUrl += name;
				});

        var stream = fs.createReadStream(files.img.path).pipe(fs.createWriteStream('./public/uploads/'+files.img.name));
        stream.on('finish', function() {
          newUrl += files.img.name;
        });

        res.redirect('/')
			});

		} else {

			console.log('We need to use the image the user sent.');
			//copy to our uploads folder, should validate and make unique
			//http://stackoverflow.com/a/11295106
			var stream = fs.createReadStream(files.img.path).pipe(fs.createWriteStream('./public/uploads/'+files.img.name));
			stream.on('finish', function() {
				newUrl += files.img.name;
				res.redirect('/')
			});

		}
	});
});

})
