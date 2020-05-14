var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/pms', {useNewUrlParser: true, useCreateIndex:true,useFindAndModify:false});

var conn = mongoose.connection;
var userSchema = new mongoose.Schema({

    username:{
        type:String,
        required:true,
        index:{
            unique:true,
        },
    },

    firstname:{
        type:String,
        requird:true,
    },
    lastname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        index:{
            unique:true,
        },
    },

    password:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now()
    }
  });
  // Here users could be table name.

var userModel = mongoose.model('users', userSchema);
module.exports=userModel;