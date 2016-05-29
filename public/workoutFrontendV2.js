document.addEventListener("DOMContentLoaded", main);

function main(){
	displayUsersTable();
	//handleInsert();
};

//global variable for keeping track of the current user
var currentUser_Id;

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
		var requestUserWorkouts = new XMLHttpRequest();
		var params = "id=" + userId;
		requestUserWorkouts.open("POST", "http://52.33.123.66:2000/getUserWorkouts", true);
		requestUserWorkouts.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		requestUserWorkouts.addEventListener("load", function(event){
			var response = requestUserWorkouts.responseText;
			console.log(response);
			var newResponseObject = JSON.parse(response);
			convertWorkoutsToTable(newResponseObject);
			currentUser_Id = userId;
			console.log("current User is now " + currentUser_Id);
		});
		requestUserWorkouts.send(params);
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
		//var workout_id = singleObjectRow.id;
		var requestExercisesForUserWorkout = new XMLHttpRequest();
		var params = "user_id=" + currentUser_Id + "&workout_id=" + singleObjectRow.id;
		requestExercisesForUserWorkout.open("POST", "http://52.33.123.66:2000/getExercisesForUserWorkout", true);
		requestExercisesForUserWorkout.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		requestExercisesForUserWorkout.addEventListener("load", function(event){
			var response = requestExercisesForUserWorkout.responseText;
			console.log(response);
		});
		requestExercisesForUserWorkout.send(params);
	});

	addTableRowToDOM(newRow, singleObjectRow.name);
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





