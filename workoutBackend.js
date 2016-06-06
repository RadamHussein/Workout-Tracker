/***********************************************************
Final Project
CS 340 - Spring 2016
Adam Smith
***********************************************************/

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

/************************************************************
* For future functionality
*************************************************************

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

    var response = {
      isEqual: true,
      userId: null,
      fname: null,
      lname: null 
    }

    console.log(typeof(rows[0]));
    console.log(rows[0]);
    if(rows[0] === undefined || rows[0] === null){
      response.isEqual = false;
    }
    else{
      response.userId = rows[0].id;
      response.fname = rows[0].first_name;
      response.lname = rows[0].last_name;
    }
    context.results = response;
    res.type('application/json');
    res.setHeader('Content-Type', 'application/json');
    res.send(context);
  });
});

******************************************************************/

app.post('/insertUser', urlencodedParser, function(req, res, next){
  var first_name = req.body.first_name;
  var last_name = req.body.last_name;
  var user_name = req.body.user_name;
  var password = req.body.password;
  var context = {};
  pool.query("INSERT INTO users (`first_name`, `last_name`, `user_name`, `password`) VALUES (?, ?, ?, ?)", [req.body.first_name, req.body.last_name, req.body.user_name, req.body.password], function(err, result){
    if(err){
      if(err.errno == 1062){
        context.results = 1062;
        res.type('text/plain');
        res.send(context);
      }
      else{
        next(err);
        return;
      }
    }
    else{
      context.results = "User created";
      res.type('text/plain');
      res.send(context);
    }
  });
});

app.post('/insertWorkout', urlencodedParser, function(req, res, next){
  var context = {};
  var currentUser_id = req.body.currentUser_id;
  var workout_name = req.body.workout_name;
  //look for existing workout in table
  pool.query("SELECT workouts.id, workouts.name FROM workouts WHERE workouts.name = (?)", [req.body.workout_name], function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    //if workout doesn't already exist create it
    if(rows[0] === undefined || rows[0] === null){
      //insert workout into workouts table
      pool.query("INSERT INTO workouts (`name`) VALUES (?)", [req.body.workout_name], function(err, result){
        if(err){
          next(err);
          return;
        }
      });

      insertWorkoutsHelper(currentUser_id, workout_name);
      context.results = "Workout created";
      res.type('text/plain');
      res.send(context);
    }
    else{
      var existing_id = rows[0].id;
      pool.query("INSERT INTO user_workouts (`uid`, `wid`) VALUES (?, ?)", [currentUser_id, existing_id], function(err, rows, fields){
        if(err){
          next(err);
          return;
        }
        context.results = "Workout created";
        res.type('text/plain');
        res.send(context);
      });
    }
  });
});

function insertWorkoutsHelper(currentUser_id, workout_name){
  //get id for workout
  pool.query("SELECT workouts.id FROM workouts WHERE workouts.name = (?)", [workout_name], function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    var newWorkout_id = rows[0].id;
    //insert workout and current user into user_workouts table
    pool.query("INSERT INTO user_workouts (`uid`, `wid`) VALUES (?, ?)", [currentUser_id, newWorkout_id], function(err, rows, fields){
      if(err){
        next(err);
        return;
      }
    });
  });
};

app.post('/insertExercise', urlencodedParser, function(req, res, next){
  var context = {};
  var currentUser_id = req.body.currentUser_id;
  var workout_id = req.body.workout_id;
  var exercise_name = req.body.exercise_name;

  pool.query("SELECT exercises.id, exercises.name FROM exercises WHERE exercises.name = (?)", [exercise_name], function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    //if exercise doesn't already exist, create it
    if(rows[0] === undefined || rows[0] === null){
      //insert new exercise into table
      pool.query("INSERT INTO exercises (`name`) VALUES (?)", [exercise_name], function(err, result){
        if(err){
          next(err);
          return;
        }
      });
      insertWorkouts_LogHelper(currentUser_id, workout_id, exercise_name);
      context.results = "Exercise created";
      res.type('text/plain');
      res.send(context);
    }
    else{
      var existing_id = rows[0].id;
      pool.query("INSERT INTO workouts_log (`user_id`, `workout_id`, `exercise_id`) VALUES (?, ?, ?)", [currentUser_id, workout_id, existing_id], function(err, rows, fields){
        if(err){
          next(err);
          return;
        }
        context.results = "Workout created";
        res.type('text/plain');
        res.send(context);
      });
    }
  });
});

function insertWorkouts_LogHelper(currentUser_id, workout_id, exercise_name){
  //get id for exercise
  pool.query("SELECT exercises.id FROM exercises WHERE exercises.name = (?)", [exercise_name], function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    var newExercise_id = rows[0].id;
    //insert workout and current user into user_workouts table
    pool.query("INSERT INTO workouts_log (`user_id`, `workout_id`, `exercise_id`) VALUES (?, ?, ?)", [currentUser_id, workout_id, newExercise_id], function(err, results){
      if(err){
        next(err);
        return;
      }
    });
  });
};

app.post('/insertSet', urlencodedParser, function(req, res, next){
  var context = {};
  var currentUser_id = req.body.user_id;
  var workout_id = req.body.workout_id;
  var exercise_id = req.body.exercise_id;
  var reps = req.body.reps;
  var weight = req.body.weight;
  var date = req.body.date;

  //check for an entry without set data
  pool.query("SELECT * FROM workouts_log WHERE workouts_log.user_id = (?) AND workouts_log.exercise_id = (?) AND workouts_log.weight IS NULL", [currentUser_id, exercise_id], function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    //if not found, create new entry
    if(rows[0] === undefined || rows[0] === null){
      pool.query("INSERT INTO workouts_log (`user_id`, `workout_id`, `exercise_id`, `weight`, `reps`, `date`) VALUES (?, ?, ?, ?, ?, ?)", [currentUser_id, workout_id, exercise_id, weight, reps, date], function(err, result){
        if(err){
          next(err);
          return;
        }
        context.results = "Set added";
        res.type('text/plain');
        res.send(context);
      });
    }
    //update every entry found without set data matching the user and the exercise id's with new set data
    else{
      for (var i=0; i<rows.length; i++){
        pool.query("UPDATE workouts_log SET weight=?, reps=?, date=? WHERE id=?", [weight || rows[i].weight, reps || rows[i].reps, date || rows[i].date, rows[i].id], function(err, result){
          if(err){
           next(err);
            return;
            }    
        });
      };
      context.results = "Set added";
      res.type('text/plain');
      res.send(context);
    }
  });
});

/*********************************************
Get contents from each table
**********************************************/

//post request for user workouts
app.post('/getUserWorkouts', urlencodedParser, function(req, res, next){
  var context = {};
  pool.query('SELECT workouts.id, workouts.name FROM users INNER JOIN user_workouts ON users.id = user_workouts.uid INNER JOIN workouts ON user_workouts.wid = workouts.id WHERE users.id = (?)', [req.body.id], function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = rows;
    res.setHeader('Content-Type', 'application/json');
    res.send(context);
  });
});

app.post('/getExercisesForUserWorkout', urlencodedParser, function(req, res, next){
  var context = {};
  pool.query('SELECT exercises.id, exercises.name FROM users INNER JOIN workouts_log ON users.id = workouts_log.user_id INNER JOIN exercises ON workouts_log.exercise_id = exercises.id WHERE users.id = (?) AND workouts_log.workout_id = (?) GROUP BY exercises.id', [req.body.user_id, req.body.workout_id], function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = rows;
    res.setHeader('Content-Type', 'application/json');
    res.send(context);
  });
});

app.post('/getSetsForUserExercise', urlencodedParser, function(req, res, next){
  var context = {};
  pool.query('SELECT weight, reps, date FROM workouts_log WHERE user_id = (?) AND exercise_id = (?) AND date IS NOT NULL ORDER BY date DESC', [req.body.user_id, req.body.exercise_id], function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = rows;
    res.setHeader('Content-Type', 'application/json');
    res.send(context);
  });
});

app.post('/searchExercises', urlencodedParser, function(req, res, next){
  var context = {};
  pool.query('SELECT exercises.id, exercises.name FROM workouts_log INNER JOIN exercises ON workouts_log.exercise_id = exercises.id WHERE workouts_log.user_id = (?) AND exercises.name = (?) GROUP BY exercises.name', [req.body.user_id, req.body.name], function(err, rows, fields){
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

//deletes a workout for a specified user
app.post('/deleteWorkout', urlencodedParser, function(req, res, next){
  var context = {};
  pool.query('UPDATE workouts_log SET workout_id = NULL WHERE user_id = (?) AND workout_id = (?)', [req.body.user_id, req.body.workout_id], function(err, result){
    if(err){
      next(err);
      return;
    }
    console.log("first query complete")
  });
  pool.query('DELETE FROM user_workouts WHERE uid = (?) AND wid = (?)', [req.body.user_id, req.body.workout_id], function(err, result){
    if(err){
      next(err);
      return;
    }
    console.log("second query complete")
    context.results = "workout deleted";
    res.type('text/plain');
    res.send(context);
  });
});

//deletes an exercise from a workout for a specified user
app.post('/deleteExercise', urlencodedParser, function(req, res, next){
  var context = {};
  pool.query('UPDATE workouts_log SET workout_id = NULL WHERE user_id = (?) AND workout_id = (?) AND exercise_id = (?)', [req.body.user_id, req.body.workout_id, req.body.exercise_id], function(err, results){
    if(err){
      next(err);
      return;
    }
    context.results = "exercise deleted";
    res.type('text/plain');
    res.send(context);
  })
})

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