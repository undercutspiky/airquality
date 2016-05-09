var express = require('express');
var router = express();
var Sensor = require('../database/sensor'); // Sensor schema with database connection

var bodyParser = require('body-parser');
router.use(bodyParser.json()); // support json encoded bodies
router.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
router.use(bodyParser.raw()); // support raw
router.use(bodyParser.text()); //support text

router.post('/api/acceptData', function(req, res) {
	var pass = req.body.pass;
    var value = req.body.value;
    var location = req.body.location;
    
    if(pass == "@arduino.esp"){
    	// Create value as per schema defined in JSON format
    	var newSensorValue = new Sensor({
    		value : value,
    		location : location
    	});
    	// Save the new value created
    	// Note that the pre fn defined in sensor.js will save timsStamp 
    	newSensorValue.save(function(err){
    		if(err)
    			throw err;
    		console.log('Value saved = '+value+' with loc = '+location);
    	});
    	// Send response
    	res.send('Value received is '+value+' from '+location);
    }
    else
    	res.send("Invalid password !");
});

// Same function as router.post for GET request
router.get('/api/acceptData', function(req, res) {
	var pass = req.param('pass');
    var value = req.param('value');
    var location = req.param('location');
    
    if(pass == "@arduino.esp"){
    	// Create value as per schema defined in JSON format
    	var newSensorValue = new Sensor({
    		value : value,
    		location : location
    	});
    	// Save the new value created
    	// Note that the pre fn defined in sensor.js will save timsStamp 
    	newSensorValue.save(function(err){
    		if(err)
    			throw err;
    		console.log('Value saved = '+value+' with loc = '+location);
    	});
    	// Send response
    	res.send('Value received is '+value+' from '+location);
    }
    else
    	res.send("Invalid password !");
});

module.exports = router;