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
		"id INT(11) NOT NULL AUTO_INCREMENT,"+
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
		"id INT(11) NOT NULL AUTO_INCREMENT,"+
		"name varchar(255),"+
		"PRIMARY KEY ('id))";
		pool.query(createString, function(err){
    	context.results = "Table 'workouts' reset or created";
    	res.send(context.results);
    	})
	});
});

app.get('/createExercises', function(req, res, next){
	var context = {};
	pool.query("DROP TABLE IF EXISTS exercises", function(err){
		var createString = "CREATE TABLE exercises("+
		"id INT(11) NOT NULL AUTO_INCREMENT,"+
		"name varchar(255),"+
		"date date,"+
		"PRIMARY KEY ('id'))";
		pool.query(createString, function(err){
			context.results = "Table 'exercises' reset or created";
			res.send(context.results);
		})
	});
});

app.get('/createSets', function(req, res, next){
	var context = {};
	pool.query("DROP TABLE IF EXISTS sets", function(err){
		var createString = "CREATE TABLE sets("+
		"id INT(11) NOT NULL AUTO_INCREMENT,"+
		"weight INT(11),"+
		"reps INT(11),"+
		"PRIMARY KEY ('id'))";
		pool.query(createString, function(err){
			context.results = "Table 'sets' reset or created";
			res.send(context.results);
		})
	});
});

app.get('/createUser_Workouts', function(req, res, next){
	var context = {};
	pool.query("DROP TABLE IF EXISTS user_workouts", function(err){
		var createString = "CREATE TABLE user_workouts("+
		"uid INT(11) NOT NULL DEFAULT '0',"+
		"wid INT(11) NOT NULL DEFAULT '0',"+
		"PRIMARY KEY ('uid', 'wid'),"+
		"KEY 'wid' ('wid'),"+
		"CONSTRAINT `user_workouts_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `users` (`id`),"+
		"CONSTRAINT `user_workouts_ibfk_2` FOREIGN KEY (`wid`) REFERENCES `workouts` (`id`))";
		pool.query(createString, function(err){
			context.results = "Table 'user_workouts' reset or created";
			res.send(context.results);
		})
	});
});

app.get('/createWorkouts_Exercises', function(req, res, next){
	var context = {};
	pool.query("DROP TABLE IF EXISTS workouts_exercises", function(err){
		var createString = "CREATE TABLE workouts_exercises("+
		"wid INT(11) NOT NULL DEFAULT '0',"+
		"eid INT(11) NOT NULL DEFAULT '0',"+
		"PRIMARY KEY ('wid', 'eid'),"+
		"KEY 'wid' ('wid'),"+
		"FOREIGN KEY (`wid`) REFERENCES `workouts` (`id`),"+
		"FOREIGN KEY (`eid`) REFERENCES `exercises` (`id`))";
		pool.query(createString, function(err){
			context.results = "Tabel 'workouts_exercises' reset or created";
			res.send(context.results);
		})
	});
});

app.get('/createExercise_Sets', function(req, res, next){
	var context = {};
	pool.query("DROP TABLE IF EXISTS exercise_sets", function(err){
		var createString = "CREATE TABLE exercise_sets("+
		"eid INT(11) NOT NULL DEFAULT '0',"+
		"sid INT(11) NOT NULL DEFAULT '0',"+
		"PRIMARY KEY ('eid', 'sid'),"+
		"KEY 'eid' ('eid'),"+
		"FOREIGN KEY (`eid`) REFERENCES `exercises` (`id`),"+
		"FOREIGN KEY (`sid`) REFERENCES `sets` (`id`))";
		pool.query(createString, function(err){
			context.results = "Table 'exercise_sets' reset or created";
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