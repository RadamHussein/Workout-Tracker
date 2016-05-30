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
		modal.find("#submit-workout-modal").on('click', function(event){
			createNewWorkout();
			console.log("Submit Clicked");
		});
	});

	//removes event listener from modal once modal is hidden
	$('#new-workout').on('hide.bs.modal', function(event){
		$('#submit-workout-modal').off();
	});
};

//global variables for keeping track of the current user and current workout
var currentUser_Id = null;
var currentWorkout_Id = null;

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
		var userId = singleObjectRow.id;
		getUserWorkous();
		/*
		var requestUserWorkouts = new XMLHttpRequest();
		var params = "id=" + userId;
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
			currentUser_Id = userId;
			console.log("current User is now " + currentUser_Id);
		});
		requestUserWorkouts.send(params);
		*/
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
		var requestExercisesForUserWorkout = new XMLHttpRequest();
		var params = "user_id=" + currentUser_Id + "&workout_id=" + singleObjectRow.id;
		requestExercisesForUserWorkout.open("POST", "http://52.33.123.66:2000/getExercisesForUserWorkout", true);
		requestExercisesForUserWorkout.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		requestExercisesForUserWorkout.addEventListener("load", function(event){
			var response = requestExercisesForUserWorkout.responseText;
			console.log(response);
			var newResponseObject = JSON.parse(response);

			resetTable("exercises_table_body");
			convertExercisesToTable(newResponseObject);
			currentWorkout_Id = singleObjectRow.id;
			console.log("Current Workouts is now " + currentWorkout_Id);
		});
		requestExercisesForUserWorkout.send(params);
	});

	addTableRowToDOM(newRow, singleObjectRow.name);
	addDeleteButton(newRow);
	/*
	var cellForButtons = document.createElement("td");
	newRow.appendChild(cellForButtons);
	var deleteButton = document.createElement("button");
	deleteButton.id = "Delete";
	deleteButton.className = "btn btn-danger";
	cellForButtons.appendChild(deleteButton);
	deleteButton.textContent = "Delete";
	*/
};

function convertExercisesToTableRow(singleObjectRow){
	var newRow = document.createElement("tr");
	document.getElementById("exercises_table_body").appendChild(newRow);
	newRow.setAttribute("class", "clickable-row");

	newRow.addEventListener("click", function(event){
		console.log("table row clicked");
		var requestSetsForUserExercise = new XMLHttpRequest();
		var params = "user_id=" + currentUser_Id + "&workout_id=" + currentWorkout_Id + "&exercise_id=" + singleObjectRow.id;
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
	});

	addTableRowToDOM(newRow, singleObjectRow.name);
	addDeleteButton(newRow);
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
	var deleteButton = document.createElement("button");
	deleteButton.id = "Delete";
	deleteButton.className = "btn btn-danger btn-sm";
	cellForButtons.appendChild(deleteButton);
	deleteButton.textContent = "Delete";
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

function getUserWorkous(){
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
			//currentUser_Id = userId;
			//console.log("current User is now " + currentUser_Id);
		});
		requestUserWorkouts.send(params);
}

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
			getUserWorkous();
		} else {
			console.log("error");
		}
	});
	insertWorkoutRequest.send(params);
};





