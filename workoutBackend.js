var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var urlencodedParser = bodyParser.urlencoded({extended: false});
app.set('port', 2000);
app.use(express.static('public'));

//connects to the database
var mysql = require('mysql');
var pool = mysql.createPool({
  host  : 'localhost',
  user  : 'student',
  password: 'default',
  database: 'workout_tracker'
});

//sets up empty database
app.get('/reset-table',function(req,res,next){
  var context = {};
  pool.query("DROP TABLE IF EXISTS workouts", function(err){
    var createString = "CREATE TABLE workouts("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "name VARCHAR(255) NOT NULL,"+
    "reps INT,"+
    "weight INT,"+
    "date DATE,"+
    "lbs BOOLEAN)";
    pool.query(createString, function(err){
    context.results = "Table reset";
    res.send(context.results);
    })
  });
});

//handle login request
app.post('/logIn', urlencodedParser, function(req, res, next){
  console.log("request recieved");
  var username = req.body.user_name;
  var password = req.body.password;
  console.log("The username recieved is " + username + " and the password recieved is " + password);
  var context = {};
  pool.query("SELECT * FROM users WHERE user_name = (?) AND password = (?)", [req.body.user_name, req.body.password], function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = rows;
    res.setHeader('Content-Type', 'application/json');
    console.log(typeof(rows));
    JSON.stringify(rows);
    console.log(rows);
    console.log(rows[0]);
    console.log(rows[0].user_name);
    console.log(rows[0].password);
    res.send(context);
  });
});

//insert into database
app.get('/insert',function(req,res,next){
  var context = {};
  pool.query("INSERT INTO workouts (`name`, `reps`, `weight`, `date`, `lbs`) VALUES (?, ?, ?, ?, ?)", [req.query.name, req.query.reps, req.query.weight, req.query.date, req.query.lbs], function(err, result){
    if(err){
      next(err);
      return;
    }
    context.results = "Inserted id " + result.insertId;
    res.type('text/plain'); //delete this once done testing
  });
});

app.get('/insertUsers', function(req, res, next){
  var context = {};
  pool.query("INSERT INTO users (`first_name`, `last_name`, `user_name`, `password`) VALUES (?, ?, ?, ?)", [req.query.first_name, req.query.last_name, req.query.user_name, req.query.password], function(err, result){
    if(err){
      next(err);
      return;
    }
    context.results = "Inserted id " + result.insertId;
    res.type('text/plain');
  });
});

app.get('/insertWorkouts', function(req, res, next){
  var context = {};
  pool.query("INSERT INTO workouts (`name`) VALUES (?)", [req.query.name], function(err, result){
    if(err){
      next(err);
      return;
    }
    context.results = "Inserted id " + result.insertId;
    res.type('text/plain');
  });
});

app.get('/insertUser_Workouts', function(req, res, next){
  var context = {};
  pool.query("INSERT INTO user_workouts (`uid`, `wid`) VALUES (?, ?)", [req.query.uid, req.query.wid], function(err, result){
    if(err){
      next(err);
      return;
    }
    context.results = "Inserted id " + result.insertId;
    res.type('text/plain');
  });
});

/*********************************************
Get contents from each table
**********************************************/

app.get('/getWorkoutsForUser', function(req, res, next){
  var context = {};
  pool.query("SELECT users.first_name, users.last_name, workouts.name FROM users INNER JOIN user_workouts ON users.id = user_workouts.uid INNER JOIN workouts ON user_workouts.wid = workouts.id WHERE users.id = (?)", [req.query.id], function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = rows;
    res.setHeader('Content-Type', 'application/json');
    res.send(context);
  });
});


app.get('/getUsers', function(req, res, next){
  var context = {};
  pool.query('SELECT * FROM users', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = rows;
    res.setHeader('Content-Type', 'application/json');
    res.send(context);
  });
});

app.get('/getWorkouts', function(req, res, next){
  var context = {};
  pool.query('SELECT * FROM workouts', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = rows;
    res.setHeader('Content-Type', 'application/json');
    res.send(context);
  });
});

app.get('/getExercises', function(req, res, next){
  var context = {};
  pool.query('SELECT * FROM exercises', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = rows;
    res.setHeader('Content-Type', 'application/json');
    res.send(context);
  });
});

app.get('/getSets', function(req, res, next){
  var context = {};
  pool.query('SELECT * FROM sets', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = rows;
    res.setHeader('Content-Type', 'application/json');
    res.send(context);
  });
});

app.get('/getUser_Workouts', function(req, res, next){
  var context = {};
  pool.query('SELECT * FROM user_workouts', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = rows;
    res.setHeader('Content-Type', 'application/json');
    res.send(context);
  });
});

app.get('/getWorkouts_Exercises', function(req, res, next){
  var context = {};
  pool.query('SELECT * FROM workouts_exercises', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = rows;
    res.setHeader('Content-Type', 'application/json');
    res.send(context);
  });
});

app.get('/getExercise_Sets', function(req, res, next){
  var context = {};
  pool.query('SELECT * FROM exercise_sets', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = rows;
    res.setHeader('Content-Type', 'application/json');
    res.send(context);
  });
});

//get database
app.get('/',function(req, res, next){
  var context = {};
  pool.query('SELECT * FROM workouts', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = rows;
    res.setHeader('Content-Type', 'application/json');
    res.send(context);
  });
});

//update database entry
app.get('/update',function(req,res,next){
  var context = {};
  pool.query("SELECT * FROM workouts WHERE id=?", [req.query.id], function(err, result){
    if(err){
      next(err);
      return;
    }
    if(result.length == 1){
      var curVals = result[0];
      pool.query("UPDATE workouts SET name=?, reps=?, weight=?, date=?, lbs=? WHERE id=? ",
        [req.query.name || curVals.name, req.query.reps || curVals.reps, req.query.weight || curVals.weight, req.query.date || curVals.date, req.query.lbs || curVals.lbs, req.query.id],
        function(err, result){
        if(err){
          next(err);
          return;
        }
        context.results = "Updated " + result.changedRows + " rows.";
        //res.render('home',context);
        res.send("Entry has been updated");
      });
    }
  });
});

//delete database entry
app.get('/delete', function(req, res, next){
  var context = {};
  //possibly change id to name 
  pool.query("DELETE FROM workouts WHERE id=?", [req.query.id], function(err, result){
    if(err){
      next(err);
      return;
    }
    context.results = "Deleted" + result.changedRows + " rows.";
    res.send("Delete successful");
  });
});

app.get('/createUsers', function(req, res, next){
  var context = {};
  pool.query("DROP TABLE IF EXISTS users", function(err){
    var createString = "CREATE TABLE users("+
    "id INT(11) PRIMARY KEY AUTO_INCREMENT,"+
    "first_name VARCHAR(255) NOT NULL,"+
    "last_name VARCHAR(255) NOT NULL,"+
    "user_name VARCHAR(255) NOT NULL,"+
    "password VARCHAR(255) NOT NULL)"+
    //"PRIMARY KEY ('id'),"+
    //"UNIQUE KEY 'password' ('password'))";
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
    "PRIMARY KEY ('id'))";
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