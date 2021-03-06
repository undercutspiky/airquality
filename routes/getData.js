var express = require('express');
var router = express();
var Sensor = require('../database/sensor'); // Sensor schema with database connection

var global_val=0, global_timeStamp=0;
var global_val2=0;

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
        // publish the update
        var currDate = new Date(Date.now());
        currDate = new Date(currDate.setHours(currDate.getUTCHours()+2));
        global_val = value;
        global_timeStamp = currDate.getTime();
        global_val2 = value;
    }
    else
    	res.send("Invalid password !");
});

router.get('/api/acceptData/events', function(req, res){
    
    res.writeHead(200, {
      'Connection': 'keep-alive',
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache'
    });


    setInterval(function() {
        if (global_val!=0 && global_timeStamp!=0){
            res.write("data: " + JSON.stringify({value: global_val, timeStamp: global_timeStamp}) + '\n\n');
            global_val = 0;
            global_timeStamp = 0;
        }
     }, 1000);
    

    console.log("SSE response sent");

});

// push notifications 
var webPush = require('web-push');
webPush.setGCMAPIKey("AIzaSyAWLySN_UaBw8gyhM4jIzwPutxG0NMqql4");

router.post('/register', function(req, res) {
    if(global_val2 !=0 && global_val2 > 1000){
        setTimeout(function() {
          webPush.sendNotification(req.query.endpoint, {
            TTL: 10,
            payload: 'High CO2 levels - ' + global_val2.toString() + ' ppm detected',
            userPublicKey: req.body.key,
            userAuth: req.body.authSecret,
          })
          .then(function() {
            res.sendStatus(201);
          });
        }, req.query.delay * 1000);
        global_val2 = 0;
    }
    
  });

module.exports = router;