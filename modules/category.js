var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/pms', {useNewUrlParser: true, useCreateIndex:true,useFindAndModify:false});
mongoose.connect('mongodb+srv://root:root@cluster0-zergu.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true,useFindAndModify:false});
const mongoosePaginate = require('mongoose-paginate-v2');
var conn = mongoose.connection;
const categorySchema=new mongoose.Schema({
    categoryname:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        requird:true,
    },
    date:{
        type:Date,
        default:Date.now()
    }
});
categorySchema.plugin(mongoosePaginate);
const categoryModel= mongoose.model('category',categorySchema);
module.exports=categoryModel;