var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/employees', {useNewUrlParser: true,useFindAndModify:false});
//mongoose.connect('mongodb+srv://root:root@cluster0-zergu.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true,useFindAndModify:false});

// mongodb+srv://root:<password>@cluster0-zergu.mongodb.net/test?retryWrites=true&w=majority
var conn = mongoose.connection;

var employeeSchema = new mongoose.Schema({
    name: String,
    email: String,
    etype: String,
    hourlyrate: Number,
    totalHours: Number,
  });

  employeeSchema.methods.totalIncome=function(){
    //console.log("Total Income of the Employee "+ this.hourlyrate*this.totalHours);
   // console.log("Total Income of the %s is %d ", this.name, this.hourlyrate*this.totalHours);
   console.log("HOURLY"+this.hourlyrate*this.totalHours);
   return this.hourlyrate*this.totalHours;
  }
var employeeModel = mongoose.model('Employee', employeeSchema);
var employee  =new employeeModel({
    name:"john",
    email:"john@gmail.com",
    etype:"hourly",
    hourlyrate:10,
    totalHours:20,
});
//console.log(employee);
//console.log("Total Income "+ employee.hourlyrate*employee.totalHours);
employee.total=employee.totalIncome();

conn.on("connected", function(){
  console.log("connected successfully");
});

conn.on("disconnected", function(){
  console.log("Disconnected successfully");
});

conn.on('error', console.error.bind(console, 'connection error:'));
conn.once('open', function() {
  // we're connected!
  /*employee.save(function(err,res){
    if(err) throw error;
    console.log(res);
    conn.close();
  });*/ 

  employeeModel.find({},function(err,data){
    if(err) throw error;
    console.log(data);
    conn.close();

  });
  /*employeeModel.findOneAndUpdate({"name":"jam"},{"name":"jackyy"}, function(err,data){
    if(err) throw error;
    console.log(data);
    conn.close();
  });*/
/*
employeeModel.findOneAndRemove({"name":"sam"}, function(err,data){
    if(err) throw error;
    console.log(data);
    conn.close();
  });*/


});



