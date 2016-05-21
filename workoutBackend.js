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
  //pool.query("INSERT INTO users (`first_name`, `last_name`, `user_name`, `password`) VALUES (?, ?, ?, ?)", [req.query.first_name, req.query.last_name, req.query.user_name, req.query.password], function(err, result){
  pool.query("INSERT INTO users (`first_name`, `last_name`, `user_name`, `password`) VALUES ('Jon', 'Snow', 'Jsnow1@gmail.com', 'winterfell2')", function(err, results){
    if(err){
      next(err);
      return;
    }
    context.results = "Inserted id " + result.insertId;
    res.type('text/plain');
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