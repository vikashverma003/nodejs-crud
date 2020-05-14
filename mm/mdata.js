var mongoose = require('mongoose');
var employeeSchema = new mongoose.Schema({
    name: String,
    email: String,
    etype: String,
    hourlyrate: Number,
    totalHours: Number,
  });

  employeeSchema.methods.totalIncome=function(){
    //console.log("Total Income of the Employee "+ this.hourlyrate*this.totalHours);
    console.log("Total Income of the %s is %d ", this.name, this.hourlyrate*this.totalHours);

  }

var employeeModel = mongoose.model('Employee', employeeSchema);
var employee  =new employeeModel({
    name:"pradeep",
    email:"pradeep@gmail.com",
    etype:"hourly",
    hourlyrate:10,
    totalHours:20,
});
//console.log(employee);
//console.log("Total Income "+ employee.hourlyrate*employee.totalHours);

employee.totalIncome();

