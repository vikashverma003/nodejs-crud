const express= require('express');
var router = express.Router();
var userModule=require('../modules/users');
var categoryModule=require('../modules/category');
var categoryDetailsModule=require('../modules/category-details');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken'); 
const { check, validationResult } = require('express-validator');

if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
  }

var getCategory=categoryModule.find({});
var getCategoryDetails=categoryDetailsModule.find({});


// middleware for checking the authentication
  function checkLoginUser(req,res,next){
      var userToken=localStorage.getItem('userToken');
      // invalid token - synchronous
        try {
            var decoded = jwt.verify(userToken, 'loginToken');
        } catch(err) {
            res.redirect('/routes');
        }
        next();
  }
  
function checkEmail(req,res,next){
    var email=req.body.email;
    var checkexitemail= userModule.findOne({email:email});
    checkexitemail.exec((err,data)=>{
        if(err) throw err;
        if(data)
        {
            res.render('signup',{title:"some dummy title", msg:'email already exist'});
        }
        next();
    });
}
function checkUser(req,res,next){
    var username=req.body.username;
    var checkexituser = userModule.findOne({username:username});
    checkexituser.exec((err,data)=>{
        if(err) throw err;
        if(data)
        {
            res.render('signup',{title:"some dummy title", msg:'username already exist'});

        }
        next();
    });
}

router.get('/signup', function(req,res,next){
    var loginUser = localStorage.getItem('loginUser');
    if(loginUser){
        res.redirect('/routes/dashboard');
    }
    else
    {
   // res.send("@@@@@@@@@Here is our get function and our first api function");
   res.render('signup',{title:"some dummy title", msg:''});
    }
});
router.post('/signup',checkEmail,checkUser, function(req,res,next){
   console.log(req.body);
   var username=req.body.uname;
   var fname=req.body.fname;
   var lname=req.body.lname;
   var email=req.body.email;
   var password=req.body.pwd;
   var cpassword=req.body.cpwd;
   if(password!=cpassword)
   {
    res.render('signup',{title:"some dummy title", msg:"password not matched"});

   }
   else
   { 
       password=bcrypt.hashSync(req.body.pwd,10);
    var userDetails= new userModule({
        username:username,
        firstname:fname,
        lastname:lname,
        email:email,
        password:password,
    });
    userDetails.save(function(err,data){
        if(err) throw err;
        console.log(data)
        res.render('signup',{title:"some dummy title", msg:"sign up has been completed"});
    });
   }
    // res.send("@@@@@@@@@Here is our get function and our first api function");
 });

 router.get('/', function(req,res,next){
    var loginUser = localStorage.getItem('loginUser');
    if(loginUser){
        res.redirect('/routes/dashboard');
    }
    else
    {
        res.render('login', {title:"Login page",msg:""})
    }

 });
 router.post('/', function(req,res,next){
    var username=req.body.uname;
    var password=req.body.pwd;

    var checkUser= userModule.findOne({username:username});
    console.log(checkUser);
    checkUser.exec((err, data)=>{
        if(err) throw err;
        var getUserID = data._id;
        var passwordDB=data.password;
        if(bcrypt.compareSync(password,passwordDB))
        {
            var token = jwt.sign({ userID: getUserID }, 'loginToken');
            localStorage.setItem('userToken',token);
            localStorage.setItem('loginUser',username);
            res.redirect('/routes/dashboard');
          // console.log(passwordDB);
            //res.render('login', {title:"Login page",msg:" login has been done successfully"});
        }
        else{
            console.log("failed");
            res.render('login', {title:"Login page",msg:"Invalid username and password"});
        }

    });

 });

 router.get('/dashboard',checkLoginUser,function(req,res,next){

    var loginUser = localStorage.getItem('loginUser');
    console.log("logged in User"+loginUser);
    res.render("dashboard",{title:"dashboard page",loginUser:loginUser,msg:''});
 });
 router.get('/logout', function(req,res,next){
     localStorage.removeItem('loginUser');
     localStorage.removeItem('userToken');
     res.redirect('/routes');
 });

router.get('/password-category',checkLoginUser,function(req,res,next){
    var loginUser = localStorage.getItem('loginUser');

    res.render('pass-category', {title:"Category page",msg:"Our Category Page",error:'',success:'',loginUser:loginUser});
});
router.get('/password-category/edit/:id',function(req,res,next){
    var passcat_id=req.params.id;
    var passEdit=categoryModule.findById(passcat_id); 
    passEdit.exec(function(err,data){
        if(err) throw err;
        res.render('edit-category', {title:"Category page",msg:"Our Category Page",error:'',success:'',records:data});
    });

});
router.post('/password-category/edit/',function(req,res,next){
    var passcat_id=req.body.id;
    var catName=req.body.catname;
    var passUpdate=categoryModule.findByIdAndUpdate(passcat_id,{categoryname:catName}); 
    passUpdate.exec(function(err,data){
        if(err) throw err;
        console.log(data);
        res.redirect('/routes/view-category/')
      //  res.render('edit-category', {title:"Category page",msg:"Our Category Page",error:'',success:'updation has been successful',records:data});
    });

});
router.get('/password-category/delete/:id',function(req,res,next){
    //res.send("sdfjsdb "+req.params.id);
    var passcat_id=req.params.id;
  //  var passDelete=getCategory.findOneAndRemove(passcat_id);
 // var passDelete=getCategory.findByIdAndDelete(passcat_id);
  var passDelete=categoryModule.findByIdAndRemove(passcat_id); 
  passDelete.exec(function(err){
        if(err) throw err;
        res.redirect('/routes/view-category/');
    });
    //res.render('pass-category', {title:"Category page",msg:"Our Category Page",error:'',success:''});
});

router.post('/password-category',[check('catname',"Must be atleast 5 character").isLength({ min: 5 }),check('pwd',"must be atleast 5 character").isLength({ min: 5 })],function(req,res,next){

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.mapped());
     // return res.status(422).json({ errors: errors.array() });
     res.render('pass-category', {title:"Category page",msg:"Our Category Page",loginUser:'',error:errors.mapped(),success:''});
    }
    else
    {
        var catname=req.body.catname;
        var pwd=req.body.pwd;
        var pwdcrypt= bcrypt.hashSync(pwd,6);
        var catDetails= new categoryModule({
                categoryname:catname,
                password:pwdcrypt,
        });
        console.log(catDetails);
        catDetails.save((err,data)=>{
            if(err) throw err;
            console.log(data);
            res.render('pass-category',{title:"Category page",msg:"Our Category Page",error:'',success:"cat has been added",loginUser:''});
            
        });

    }
});

router.get('/view-category', checkLoginUser,function(req,res,next){
    var loginUser = localStorage.getItem('loginUser');
    var options = {
        offset:   1,
        limit:    2
      };

      categoryModule.paginate({}, options).then(function(result) {
        console.log(result);
        res.render('view-category',{title:"view category", msg:"view category data",loginUser:loginUser,
        current:result.offset,
       // pages:Math.ceil(result.total/result.limit),
        pages:5,
        records:result.docs,
    });

        // result.docs - empty array
        // result.totalDocs
        // result.limit - 0
      });

    /*getCategory.exec((err,data)=>{
        if(err) throw err;
       
        res.render('view-category',{title:"view category", msg:"view category data",loginUser:loginUser,records:data});

     }); */
});

router.get('/view-all-password/:page',checkLoginUser, function(req, res, next) {
    var loginUser = localStorage.getItem('loginUser');

    var perPage = 1;
      var page = req.params.page || 1;
  
      categoryModule.find({})
             .skip((perPage * page) - perPage)
             .limit(perPage).exec(function(err,data){
                  if(err) throw err;
                  categoryModule.countDocuments({}).exec((err,count)=>{          
    res.render('view-category', {title:"view category", msg:"view category data", records: data,
    loginUser:loginUser,
    current: page,
    pages: Math.ceil(count / perPage) });
    
  });
    });
    
  });



router.get('/details-category',checkLoginUser,function(req,res,next){
    var loginUser = localStorage.getItem('loginUser');

    getCategory.exec(function(err,data){
        if(err) throw err;
        res.render('details-category',{title:"view details page", msg:"nothing",loginUser:loginUser,records:data,success:''});
    });

});

router.post('/details-category',function(req,res,next){
    var catname=req.body.catename;
    var catedetails=req.body.category;
    var project_name=req.body.project_name;

    var categoryDetails=new categoryDetailsModule({ 
        categoryname:catname,
        categorydetails:catedetails,
        project_name:project_name,
    });
    categoryDetails.save(function(err,data){
        if(err) throw err;
        console.log(data);
        res.render('details-category',{title:"view details page", msg:"nothing",records:'',success:"Cat details has been inserted successfully",loginUser:''});
    });
    //console.log(req.body);
    //res.render('details-category',{title:"view details page", msg:"nothing"});
});

router.get('/view-details-category',checkLoginUser, function(req,res,next){
    //res.send("Coming soon");
    var loginUser = localStorage.getItem('loginUser');

    getCategoryDetails.exec(function(err,data){
        if(err) throw err;
        console.log(data);
        res.render('view-details-category',{title:"Here is our details category page",msg:"details page",loginUser:loginUser,records:data});
    });
});
router.get('/view-details-category/edit/:id', function(req,res,next){
    var details_id=req.params.id;
    var editDetails=categoryDetailsModule.findById(details_id);
    editDetails.exec(function(err,data){
        if(err) throw err;
        getCategoryDetails.exec(function(err,data1){
            if(err) throw err;
            //console.log(data);
            res.render('edit-details-category',{title:"Here is our details category page",msg:"details page",records:data,record:data1});
        });

    });
});
router.post('/view-details-category/edit/', function(req,res,next){

    console.log(req.body);
    var details_id=req.body.id;
    var catname=req.body.catname;
    var project=req.body.projectname;
    var category=req.body.category;
    var updateDetails=categoryDetailsModule.findByIdAndUpdate(details_id,{categoryname:catname,project_name:project,categorydetails:category});
    updateDetails.exec(function(err){
        if(err) throw err;
        res.redirect('/routes/view-details-category/');
    });
});

router.get('/view-details-category/delete/:id', function(req,res,next){
    var details_id=req.params.id;
    var deleteDetails=categoryDetailsModule.findByIdAndRemove(details_id);
    deleteDetails.exec(function(err){
        if(err) throw err;
        res.redirect('/routes/view-details-category/');
    });
});


module.exports=router;