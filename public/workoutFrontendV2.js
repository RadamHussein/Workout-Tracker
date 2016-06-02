document.addEventListener("DOMContentLoaded", main);

function main(){
	displayUsersTable();
	//handleInsert();

	//this executes code for adding a user when the add user modal is shown
	$('#new-user').on('show.bs.modal', function(event){
		var modal = $(this);
		console.log('Modal is shown');
		modal.find("#submit-modal").on('click', function(event){
			createNewUser();
			console.log("Submit Clicked");
		});
	});

	//removes event listener from modal once modal is hidden
	$('#new-user').on('hide.bs.modal', function(event){
		$('#submit-modal').off();
	});

	//this executes code for adding a workout when the add workout modal is shown
	$('#new-workout').on('show.bs.modal', function(event){
		var modal = $(this);
		console.log('Modal is shown');
		//check if a user is selected
		if(currentUser_Id == null){
			//insert an error message into the modal
			$('#workout-body').append("<h4 class='modal-error'>You must select a user before adding a workout</h4>");
			$('#submit-workout-modal').prop("disabled");
		}
		else{
			modal.find("#submit-workout-modal").on('click', function(event){
				createNewWorkout();
				console.log("Submit Clicked");
			});
		}
		
	});

	//removes event listener from modal once modal is hidden
	$('#new-workout').on('hide.bs.modal', function(event){
		$('#submit-workout-modal').off();
		$('.modal-error').remove();
		$('#submit-workout-modal').removeProp("disabled");
	});

	//this executes code for adding a workout when the add exercise modal is shown
	$('#new-exercise').on('show.bs.modal', function(event){
		var modal = $(this);
		console.log('Modal is shown');
		if(currentWorkout_Id == null){
			$('#exercise-body').append("<h4 class='modal-error'>You must select a workout before adding an exercise</h4>")
		}
		else{
			modal.find("#submit-exercise-modal").on('click', function(event){
				createNewExercise();
				console.log("Submit Clicked");
			});
		}
	});

	//removes event listener from modal once modal is hidden
	$('#new-exercise').on('hide.bs.modal', function(event){
		$('#submit-exercise-modal').off();
		$('.modal-error').remove();
	});

	//this executes code for adding a set when the new set modal is shown
	$('#new-set').on('show.bs.modal', function(event){
		var modal = $(this);
		console.log('Modal is shown');
		if(currentExercise_Id == null){
			$('#set-body').append("<h4 class='modal-error'>You must select an exercise before adding a new set</h4>");
		}
		else{
			modal.find("#submit-set-modal").on('click', function(event){
				createNewSet();
				console.log("Submit Clicked");
			});
		}
	});

	//removes event listener from modal once modal is hidden
	$('#new-set').on('hide.bs.modal', function(event){
		$('#submit-set-modal').off();
		$('.modal-error').remove();
	});

	//adds event listener to search button
	var search = document.getElementById("search-button");
	search.addEventListener("click", function(event){
		event.preventDefault();
		document.getElementById("error-message").textContent = "";
		searchExercises();
	});

	//this executes code for deleting a workout when the delete workout modal is shown
	$('#delete-workout').on('show.bs.modal', function(event){
		var modal = $(this);
		console.log('Modal is shown');
		modal.find("#delete-workout-modal").on('click', function(event){
			deleteWorkout();
			console.log("Submit Clicked");
		});
	});

	//removes event listener from modal once modal is hidden
	$('#new-set').on('hide.bs.modal', function(event){
		$('#delete-workout-modal').off();
	});

	//this executes code for deleting a workout when the delete workout modal is shown
	$('#delete-exercise').on('show.bs.modal', function(event){
		var modal = $(this);
		console.log('Modal is shown');
		modal.find("#delete-exercise-modal").on('click', function(event){
			deleteExercise();
			console.log("Submit Clicked");
		});
	});

	//removes event listener from modal once modal is hidden
	$('#new-set').on('hide.bs.modal', function(event){
		$('#delete-exercise-modal').off();
	});

};

//global variables for keeping track of the current user and current workout
var currentUser_Id = null;
var currentWorkout_Id = null;
var currentExercise_Id = null;

//takes a single cell of table data and adds it to the current row
function addTableRowToDOM(newRow, singleTableItem){
	var cellData = document.createElement("td");
	newRow.appendChild(cellData);
	cellData.textContent = singleTableItem;
};

//add workouts to the table
function convertUsersToTableRow(singleObjectRow){

	//get cell data from each element in the object and add to DOM
	var newRow = document.createElement("tr");
	document.getElementById("tableBody").appendChild(newRow);
	newRow.setAttribute("class", "clickable-row");
	var rowId = singleObjectRow.id;
	newRow.setAttribute("href", rowId);

	newRow.addEventListener("click", function(event){
		console.log("table row clicked");
		currentUser_Id = singleObjectRow.id;
		getUserWorkouts();
	});
	
	//cut the time off the end of the date
	//var formattedDate = singleObjectRow.date.slice(0, 10);

	//send to function to add entry to table
	addTableRowToDOM(newRow, singleObjectRow.first_name);
	addTableRowToDOM(newRow, singleObjectRow.last_name);
	addTableRowToDOM(newRow, singleObjectRow.user_name);
	addTableRowToDOM(newRow, singleObjectRow.password);
};

function convertWorkoutsToTableRow(singleObjectRow){
	var newRow = document.createElement("tr");
	document.getElementById("workouts_table_body").appendChild(newRow);
	newRow.setAttribute("class", "clickable-row");

	newRow.addEventListener("click", function(event){
		console.log("table row clicked");
		currentWorkout_Id = singleObjectRow.id;
		getUserExercises();
	});

	addTableRowToDOM(newRow, singleObjectRow.name);
	addDeleteButton(newRow);
};

function convertExercisesToTableRow(singleObjectRow){
	var newRow = document.createElement("tr");
	document.getElementById("exercises_table_body").appendChild(newRow);
	newRow.setAttribute("class", "clickable-row");

	newRow.addEventListener("click", function(event){
		console.log("table row clicked");
		currentExercise_Id = singleObjectRow.id;
		getExerciseSets();
	});

	addTableRowToDOM(newRow, singleObjectRow.name);
	addDeleteExerciseButton(newRow);
};

function convertSetsToTableRow(singleObjectRow){
	var newRow = document.createElement("tr");
	document.getElementById("sets_table_body").appendChild(newRow);
	addTableRowToDOM(newRow, singleObjectRow.reps);
	addTableRowToDOM(newRow, singleObjectRow.weight);

	var formattedDate = singleObjectRow.date.slice(0, 10);
	addTableRowToDOM(newRow, formattedDate);
};

//iterates through data returned form mysql and send individual objects to be added to table.
function convertUsersToTable(objList){
	for (var i=0; i<objList.results.length; i++){
		convertUsersToTableRow(objList.results[i])
	}
};

function convertWorkoutsToTable(objList){
	for (var i=0; i<objList.results.length; i++){
		convertWorkoutsToTableRow(objList.results[i]);
	};
};

function convertExercisesToTable(objList){
	for (var i=0; i<objList.results.length; i++){
		convertExercisesToTableRow(objList.results[i]);
	};
};

function convertSetsToTable(objList){
	for (var i=0; i<objList.results.length; i++){
		convertSetsToTableRow(objList.results[i]);
	};
};

//this function clears the table so that a new one can be built after a change
function resetTable(table_id){
	var newTableBody = document.createElement("tbody");
	var oldTableBody = document.getElementById(table_id);
	oldTableBody.parentNode.replaceChild(newTableBody, oldTableBody);
	newTableBody.id = table_id;
}

function addDeleteButton(newRow){
	var cellForButtons = document.createElement("td");
	newRow.appendChild(cellForButtons);
	cellForButtons.innerHTML = "<button class='btn btn-danger btn-sm' data-toggle='modal' data-target='#delete-workout' id='Delete'>Delete</button>";
}

function addDeleteExerciseButton(newRow){
	var cellForButtons = document.createElement("td");
	newRow.appendChild(cellForButtons);
	cellForButtons.innerHTML = "<button class='btn btn-danger btn-sm' data-toggle='modal' data-target='#delete-exercise' id='Delete'>Delete</button>";
}

//gets users data from database 
function getUsers(Users){
	//calls get and returns a list of objects
	var request = new XMLHttpRequest();
	request.open("GET", "http://52.33.123.66:2000/getUsers", true);
	request.withCredentials = true;
	request.addEventListener("load", function(){
		var response = request.responseText;
		console.log(response);
		var objectListFromDatabase = JSON.parse(response); //change it to an object
		console.log(typeof(objectListFromDatabase));
		Users(objectListFromDatabase); // Call the callback provided by the caller
	});
	request.send(null);
};


//gets called first. Calls getWorkouts and calls converWorkoutsToTable with results;
function displayUsersTable(){
	//Actually insert all of these construct elements into the DOM
	console.log("Displaying users...");
	getUsers(function Users(objectListFromDatabase){
		convertUsersToTable(objectListFromDatabase);
	});
};

function getUserWorkouts(){
	var requestUserWorkouts = new XMLHttpRequest();
		var params = "id=" + currentUser_Id;
		requestUserWorkouts.open("POST", "http://52.33.123.66:2000/getUserWorkouts", true);
		requestUserWorkouts.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		requestUserWorkouts.addEventListener("load", function(event){
			var response = requestUserWorkouts.responseText;
			console.log(response);
			var newResponseObject = JSON.parse(response);

			resetTable("workouts_table_body");
			resetTable("exercises_table_body");
			resetTable("sets_table_body");
			convertWorkoutsToTable(newResponseObject);
			//currentWorkout_Id = null;
			//currentExercise_Id = null;
		});
		requestUserWorkouts.send(params);
}

function getUserExercises(){
	var requestUserExercises = new XMLHttpRequest();
		var params = "user_id=" + currentUser_Id + "&workout_id=" + currentWorkout_Id;
		requestUserExercises.open("POST", "http://52.33.123.66:2000/getExercisesForUserWorkout", true);
		requestUserExercises.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		requestUserExercises.addEventListener("load", function(event){
			var response = requestUserExercises.responseText;
			console.log(response);
			var newResponseObject = JSON.parse(response);

			resetTable("exercises_table_body");
			resetTable("sets_table_body");
			convertExercisesToTable(newResponseObject);
			//currentUser_Id = userId;
			//console.log("current User is now " + currentUser_Id);
		});
		requestUserExercises.send(params);
}

function getExerciseSets(){
	var requestSetsForUserExercise = new XMLHttpRequest();
		var params = "user_id=" + currentUser_Id + "&exercise_id=" + currentExercise_Id;
		requestSetsForUserExercise.open("POST", "http://52.33.123.66:2000/getSetsForUserExercise", true);
		requestSetsForUserExercise.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		requestSetsForUserExercise.addEventListener("load", function(event){
			var response = requestSetsForUserExercise.responseText;
			console.log(response);
			var newResponseObject = JSON.parse(response);

			resetTable("sets_table_body");
			convertSetsToTable(newResponseObject);
		});
		requestSetsForUserExercise.send(params);
}

function searchExercises(){
	var name = document.getElementById("search").value;
	if(currentUser_Id == null){
		document.getElementById("error-message").textContent = "Please select a user to search";
	}
	else if(name == null){
		document.getElementById("error-message").textContent = "No search term entered";
	}
	else{
		document.getElementById("error-message").textContent = "";
		var params = "user_id=" + currentUser_Id + "&name=" + name;
		var searchRequest = new XMLHttpRequest();
		searchRequest.open("POST", "http://52.33.123.66:2000/searchExercises", true);
		searchRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		searchRequest.addEventListener("load", function(event){
			var response = searchRequest.responseText;
			console.log(response);
			var newResponseObject = JSON.parse(response);
			console.log(newResponseObject.results[0]);

			if(newResponseObject.results[0] == null || newResponseObject.results[0] == undefined){
				document.getElementById("error-message").textContent = "No exercise found";
			}
			else{
				document.getElementById("error-message").textContent = "";
				resetTable("exercises_table_body");
				resetTable("sets_table_body");
				convertExercisesToTable(newResponseObject);
			}
		});
		searchRequest.send(params);
	}
};

//deletes the selected workout for the current user
function deleteWorkout(){
	var deleteRequest = new XMLHttpRequest();
	var params = "user_id=" + currentUser_Id + "&workout_id=" + currentWorkout_Id;
	deleteRequest.open("POST", "http://52.33.123.66:2000/deleteWorkout", true);
	deleteRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	deleteRequest.addEventListener("load", function(event){
		var response = deleteRequest.responseText;
		console.log(response);
		resetTable("workouts_table_body");
		resetTable("exercises_table_body");
		resetTable("sets_table_body");
		getUserWorkouts();
		//currentWorkout_Id = null;
	});
	deleteRequest.send(params);
};

//deletes the selected exercise from the current workout for the current user
function deleteExercise(){
	var deleteExerciseRequest = new XMLHttpRequest();
	var params = "user_id=" + currentUser_Id + "&workout_id=" + currentWorkout_Id + "&exercise_id=" + currentExercise_Id;
	deleteExerciseRequest.open("POST", "http://52.33.123.66:2000/deleteExercise", true);
	deleteExerciseRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	deleteExerciseRequest.addEventListener("load", function(event){
		var response = deleteExerciseRequest.responseText;
		console.log(response);
		resetTable("exercises_table_body");
		resetTable("sets_table_body");
		getUserExercises();
		//currentExercise_Id = null;
	});
	deleteExerciseRequest.send(params);
};
/**************************************************
* Functions to handle inserting into the database
***************************************************/

//add logic for reseting current user table and adding new user to html user table!!!
function createNewUser(){
		var fname = document.getElementById("first_name-modal").value;
		var lname = document.getElementById("last_name-modal").value;
		var username = document.getElementById("user_name-modal").value;
		var password = document.getElementById("password-modal").value;
		var params = "first_name=" + fname + "&last_name=" + lname + "&user_name=" + username + "&password=" + password;
		var insertRequest = new XMLHttpRequest();

		insertRequest.open("POST", "http://52.33.123.66:2000/insertUser", true);
		insertRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		insertRequest.addEventListener("load", function(event){
			if (insertRequest.status >= 200 && insertRequest.status < 400){
				var response = insertRequest.responseText;
				console.log(response);
			} else {
				console.log("error");
			}
		});
		insertRequest.send(params);
};

//adds a new workout for the selected user
function createNewWorkout(){
	var workout_name = document.getElementById("workout_name-modal").value;
	var params = "currentUser_id=" + currentUser_Id + "&workout_name=" + workout_name;
	var insertWorkoutRequest = new XMLHttpRequest();

	insertWorkoutRequest.open("POST", "http://52.33.123.66:2000/insertWorkout", true);
	insertWorkoutRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	insertWorkoutRequest.addEventListener("load", function(event){
		if (insertWorkoutRequest.status >= 200 && insertWorkoutRequest.status < 400){
			var response = insertWorkoutRequest.responseText;
			console.log(response);
			//set current workout to null so user can't add exercise without selecting the new workout first
			currentWorkout_Id = null;
			getUserWorkouts();
		} else {
			console.log("error");
		}
	});
	insertWorkoutRequest.send(params);
};

function createNewExercise(){
	if(currentWorkout_Id == null){
		//do something here
	}
	else{
		var exercise_name = document.getElementById("exercise_name-modal").value;
		var params = "currentUser_id=" + currentUser_Id + "&workout_id=" + currentWorkout_Id + "&exercise_name=" + exercise_name;
		var insertExerciseRequest = new XMLHttpRequest();

		insertExerciseRequest.open("POST", "http://52.33.123.66:2000/insertExercise", true);
		insertExerciseRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		insertExerciseRequest.addEventListener("load", function(event){
			if (insertExerciseRequest.status >= 200 && insertExerciseRequest.status < 400){
				var response = insertExerciseRequest.responseText;
				console.log(response);
				getUserExercises();
			} else {
				console.log("error");
			}
		});
		insertExerciseRequest.send(params);
	}	
};

function createNewSet(){
	console.log("current user id is " + currentUser_Id);
	var reps = document.getElementById("reps-modal").value;
	var weight = document.getElementById("weight-modal").value;
	var date = document.getElementById("date-modal").value;
	var params = "user_id=" + currentUser_Id + "&workout_id=" + currentWorkout_Id + "&exercise_id=" + currentExercise_Id + "&reps=" + reps + "&weight=" + weight + "&date=" + date;
	insertSetRequest = new XMLHttpRequest();

	insertSetRequest.open("POST", "http://52.33.123.66:2000/insertSet", true);
	insertSetRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	insertSetRequest.addEventListener("load", function(event){
		if (insertSetRequest.status >= 200 && insertSetRequest.status < 400){
			var response = insertSetRequest.responseText;
			console.log(response);
			getExerciseSets();
		} else {
			console.log("error");
		}
	});
	insertSetRequest.send(params);
};





