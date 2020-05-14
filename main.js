const express= require('express');
const bodyParser = require('body-parser')
const app = express();
app.use(express.static('public')) // it avoids the use of public in any path.
const { check, validationResult } = require('express-validator'); // for valid error and message
const {matchedData, sanitizeBody} = require('express-validator');
var ourApi=require('./api/add-category');
var ourRoutes=require('./routes/index');
app.use('/api', ourApi);

/* for the template engine */
//app.set('view engine', 'twig') // for the templating engine
app.set('view engine', 'ejs') // for the templating engine

app.set('views', './public/views') // for the templating engine

/* for the body parser */
app.use(bodyParser.urlencoded({ extended: false })) // parse application/x-www-form-urlencoded
app.use(bodyParser.json()) // parse application/json
/* for the express validator */
app.use('/routes', ourRoutes);

app.get('/', function (req, res) {
    res.render('index1', { title: 'Heymm', message: 'Hello therenbnbnb!' })
  })

app.post('/',[
  // username must be an email
  check('username','username should be email id' ).isEmail(),
  // password must be at least 5 chars long
  check('password', 'must be 5 in length').isLength({ min: 5 }),
  check('cpassword', 'must be 5 in length').isLength({ min: 5 })

] ,function (req, res) {

 // Finds the validation errors in this request and wraps them in an object with handy functions
 const errors = validationResult(req);
 console.log(errors.mapped());
  console.log(req.body);
  if(!errors.isEmpty())
  {
    const user= matchedData(req);
    res.render('index', { userdetails:'Here we have user details',error:errors.mapped(),user:user })
  }
  else
  {
    //const allData = matchedData(req);
    //console.log("Here is all data"+allData);
    const user= matchedData(req);
    console.log(user);
      //res.render('login', { userdetails:'Here we have user details',username: req.body.username, password: req.body.password})
      res.render('login', { userdetails:'Here we have user details',user:user})

  }
  })

  app.get('/about/:a-:b', function (req, res) {
    res.render('about', { title: 'Heymm', message: 'Hello Here is about page section!',
     'add':parseInt(req.params.a)+parseInt(req.params.b), mul:parseInt(req.params.a)*parseInt(req.params.b)})
  })


// must use this to listen on some port 
app.listen(3000,()=>console.log("server running on port 3000"));