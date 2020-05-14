const express= require('express');
var router = express.Router();

router.get('/getCategory', function(req,res){

    res.send("Here is our get function and our first api function");
});

router.post('/add-Category', function(req, res,next){


    res.send("Here is our post category function");
});

router.put('/update-category', function(req, res,next){


    res.send("Here is our update category function");
});
router.delete('/delete-category', function(req, res,next){


    res.send("Here is our delete category function");
});

router.patch('/patch-category', function(req, res,next){


    res.send("Here is our patch category function");
});



module.exports=router;