var express = require('express');
var app = express();
app.set('port', 2000);
app.use(express.static('public'));

//connects to the database
var mysql = require('mysql');
var pool = mysql.createPool({
  host  : 'localhost',
  user  : 'student',
  password: 'default',
  database: 'student'
});

app.get('/createUsers', function(req, res, next){
	var context = {};
	pool.query("DROP TABLE IF EXISTS users", function(err){
		var createString = "CREATE TABLE users("+
		"id INT (11) NOT NULL AUTO INCREMENT,"+
		"first_name varchar(255) NOT NULL,"+
		"last_name varchar(255) NOT NULL,"+
		"user_name varchar(255) NOT NULL,"+
		"password varchar(255) NOT NULL,"+
		"PRIMARY KEY ('id'),"+
		"UNIQUE KEY 'password' ('password'))";
		pool.query(createString, function(err){
    	context.results = "Table 'users' reset or created";
    	res.send(context.results);
    	})
	});
});

app.get('/createWorkouts', function(req, res, next){
	var context = {};
	pool.query("DROP TABLE IF EXISTS workouts", function(err){
		var createString = "CREATE TABLE workouts("+
		"id INT(11) NOT NULL AUTO INCREMENT,"+
		"name varchar(255),"+
		"date date,"+
		"PRIMARY KEY ('id))";
		pool.query(createString, function(err){
    	context.results = "Table 'workouts' reset or created";
    	res.send(context.results);
    	})
	});
});


app.use(function(req,res){
  res.type('text/plain');
  res.status(404);
  res.send('404 - Not Found');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.send('500 - Server Error');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});