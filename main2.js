const express= require('express');
const app = express();
app.use(express.static('public')) // it avoids the use of public in any path.
var mw = require('./my-middleware.js')
app.use(mw({ option1: '1', option2: '2' }))

// Use of middleware
/*var myLogger = function (req, res, next) {
    console.log('LOGGED')
    next()
  } */
  // writing the custom middleware
  var myLogger = function (req, res, next) {
      if(req.params.username ==='pradeep')
      console.log("user validated");
      else
      console.log("users not validated");

    //console.log('LOGGED')
      next()
  }


 // app.use(myLogger);

 app.get('/',(req,res)=>{

    res.send("workingnbvnvn");
});

app.get('/user/:username',myLogger, (req,res)=>{

    res.send("user is working "+ req.params.username);
});

/*
app.get('/', (req, res)=>{
    res.send("Here we are using the express js");
});

app.get('/users/:id/book/:bookid', (req, res)=>{
    console.log(req.params);
    res.send("Here we are accessing the users data"+ req.params.id + " and book " + req.params.bookid);
});

// passing the optional parameter.
app.get('/users/:id?', (req,res)=>{

    console.log(req.params);
    if( req.params.id)
    res.send("our data"+ req.params.id);
    else
    res.send("NO ID IS PASSED");

});

// Route with parameter tuts
app.get('/flights/:From-:To', (req,res)=>{

    console.log(req.params);
    res.send("Our flight " + " from "+ req.params.From + " TO "+ req.params.To);

});


app.get('/trains/:From?.:To?', (req,res)=>{

    console.log(req.params);
    res.send("Our flight " + " from "+ req.params.From + " TO "+ req.params.To);

});

// accessing the params from the given url.( from the pattern )
// accessing as objects

app.get("/ab*cd", (req,res)=>{

    console.log(req.params);
    res.send("Here we params " + req.params[0]);


});

// Use Route Parameter with Slash Character in express js 

app.get(/.*fly$/, function (req, res) {
    res.send("Here our matching pattern is "+ '/.*fly$/')
  })


// accesing the html file and also use the static middleware for accessing the images.
app.get('/images', (req,res)=>{

    res.sendFile(__dirname + '/index.html');
}); */
// must use this to listen on some port 
app.listen(3000,()=>console.log("server running on port 3000"));