var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/pms', {useNewUrlParser: true, useCreateIndex:true,useFindAndModify:false});
mongoose.connect('mongodb+srv://root:root@cluster0-zergu.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true,useFindAndModify:false});

var conn = mongoose.connection;
const categoryDetailsSchema=new mongoose.Schema({
    categoryname:{
        type:String,
        required:true,
    },
    project_name:{
        type:String,
        required:true,
    },
    categorydetails:{
        type:String,
        requird:true,
    },
    date:{
        type:Date,
        default:Date.now()
    }
});

const categoryDetailsModel= mongoose.model('category-details',categoryDetailsSchema);
module.exports=categoryDetailsModel;