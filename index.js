/******************************************************************/

/*Author: aafaque */

/*****************************************************************/

const express = require('express')
const bodyParser= require('body-parser')
const MongoClient = require('mongodb').MongoClient
const app = express();

app.use(bodyParser.urlencoded({extended: true}))
app.use("/stylesheet",express.static(__dirname + "/stylesheet"));
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
      res.render('index.ejs', {users: result})
    })
  })

  app.post('/users', (req, res) => {
    db.collection('users').save(req.body, (err, result) => {
      if (err) return console.log(err)

      console.log('saved to database')
      res.redirect('/')
    })
  })
})
