var mongoose = require('mongoose');
var dbURI = 'mongodb://localhost/Loc8r';
// 'cause I keep forgetting
// mongodb://testuser:testpassword@ds027709.mlab.com:27709/loc8r
//
if(process.env.NODE_ENV == 'production'){
	dbURI = process.env.MONGOLAB_URI;
}
mongoose.connect(dbURI);

require('./locations');
/* forcing a global promise subverts the deprecation issue */
mongoose.Promise = global.Promise;
var logDB = mongoose.createConnection(dbURI);

/* called on connect / disconnect */
mongoose.connection.on('connected', function (){
	console.log('Mongoose connected to' + dbURI);
});
mongoose.connection.on('error', function(err){
	console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function(){
	console.log('Mongoose connection disconnected');
});

/* on process termination */
process.once('SIGUSR2', function(){
	gracefulShutdown('nodemon restart', function(){
		process.kill(process.pid, 'SIGUSR2');
	});
});
process.on('SIGINT', function(){
	gracefulShutdown('app termination', function(){
		process.exit(0);
	});
})
process.on('SIGTERM', function(){
	gracefulShutdown('Heroku app shutdown', function(){
		process.exit(0);
	});
});

/* disconnects mongo properly upon recieving a disconnect message */
var gracefulShutdown = function(msg, callback){
	mongoose.connection.close(function(){
		console.log('Mongoose disconnected through ' + msg);
		callback();
	});
};