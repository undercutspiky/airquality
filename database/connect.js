// Connect to the database called airquality
var mongoose = require('mongoose');
var host = process.env.OPENSHIFT_MONGODB_DB_HOST;
var port = process.env.OPENSHIFT_MONGODB_DB_PORT;

if (typeof host != 'undefined' && typeof port !='undefined')
	mongoose.connect('mongodb://admin:TW5-q6AvY7hz@'+host+':'+port+'/airquality');
else
	mongoose.connect('mongodb://localhost/airquality');

module.exports = mongoose;