var Sensor = require('../database/sensor'); // Sensor schema with database connection
var express = require('express');
var router = express();
// get data fora particular time interval
// the variable here should be an input from user 
var monthAgo = new Date(Date.now());
monthAgo.setMonth(monthAgo.getMonth() - 1);

router.get('/showData',function(req,res){
	var response = "Values found are ";
	Sensor.find().where('timeStamp').gt(monthAgo).exec(function(err, values) {
		if (err) throw err;

		// show the admins in the past month
		//console.log(values);
		for(var i in values){
			console.log(values[i].value);
			response += ' '+ values[i].value.toString();
		}
		console.log(response);
		res.send(response);
	});
});

module.exports = router;