var mongoose = require('./connect');
var Schema = mongoose.Schema;

// Create a schema for data to be saved
var sensorSchema = new Schema({
  timeStamp: Date,
  value: Number,
  location: String
});

//Set the time stamp before saving data
sensorSchema.pre('save', function(next){
  var currDate = new Date(Date.now());
  //Set time to Lugano's time (offset is +2 due to daylight savings)
  currDate = new Date(currDate.setHours(currDate.getUTCHours()+2));
  this.timeStamp = currDate;
  next();
});

var Sensor = mongoose.model('Sensor', sensorSchema);

module.exports = Sensor;