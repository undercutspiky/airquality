var Sensor = require('../database/sensor'); // Sensor schema with database connection
var express = require('express');
var router = express();
// get data fora particular time interval
// the variable here should be an input from user 
var monthAgo = new Date(Date.now());
monthAgo.setMonth(monthAgo.getMonth() - 1);


router.get('/testData',function(req,res){
	var response = [];
	Sensor.find().where('timeStamp').gt(monthAgo).exec(function(err, values) {
		if (err) throw err;

		// show the admins in the past month
		//console.log(values);
		for(var i in values){
			console.log(values[i].value);
			response.push(values[i].value);
		}
		console.log(response);
		res.send(response);
	});
});

router.get('/sortedData',function(req,res){
	var res_date = [];
	var res_value = [];
	Sensor.find({}).sort('timeStamp').exec(function(err, docs) {
		if(err) throw err;

		for(var i in docs)
		{
			res_date.push(docs[i].timeStamp.getTime());
			res_value.push(docs[i].value);
		}
		res.send([res_date, res_value]);
	});
});


module.exports = router;
