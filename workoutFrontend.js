/*Workout Tracker
Adam Smith
CS290 - Winter 2016
*/

//document.addEventListener("DOMContentLoaded", displayWorkoutsTable);
document.addEventListener("DOMContentLoaded", main);

function main(){
	displayWorkoutsTable();

//#1
function getWorkouts(workouts){
	//calls get and returns a list of objects
	var request = new XMLHttpRequest();
	request.open("GET", "http://52.33.123.66:3000/", true);
	request.withCredentials = true;
	request.addEventListener("load", function(){
		var response = request.responseText;
		document.getElementById("response").textContent = response;
		var objectListFromDatabase = JSON.parse(response); //change it to an object
		console.log(typeof(objectListFromDatabase)); //did it change to an object?
		workouts(objectListFromDatabase); // Call the callback provided by the caller
	});
	request.send(null);
};

//#2
function convertWorkoutToTableRow(singleObjectRow){
	//<---Problem #2--->
	//I can go about this 2 ways from here:

	//First method:
	/*a function that converts a single object to a row element with a column
	 for each property in the object. 
	 This function should not actually put anything into the DOM.
	
	var newRow = document.createElement("tr");
	for (var item in singleObjectRow){
		var cellData = document.createElement("td");
		cellData.textContent = item;
		//return something here
	}
	
	Now I have a variable for the new row, and multiple variables
	which each contain data for individual cells in that row. How
	should I return these to the previous function? Combine them in to a 
	row object?
	*/

	//Second Method: 
	//get cell data from each element in the object and add to DOM
	var newRow = document.createElement("tr");
	document.getElementById("tableBody").appendChild(newRow);
	
	addTableRowToDOM(newRow, singleObjectRow.name);
	addTableRowToDOM(newRow, singleObjectRow.reps);
	addTableRowToDOM(newRow, singleObjectRow.weight);
	addTableRowToDOM(newRow, singleObjectRow.date);
	addTableRowToDOM(newRow, singleObjectRow.lbs);

	//create buttons
	var editButton = document.createElement("button");
	editButton.id = "Edit";
	var cellForButtons = document.createElement("td");
	newRow.appendChild(cellForButtons);
	cellForButtons.appendChild(editButton);
	editButton.textContent = "Edit";

	var deleteButton = document.createElement("button");
	deleteButton.id = "Delete";
	cellForButtons.appendChild(deleteButton);
	deleteButton.textContent = "Delete";
	deleteButton.addEventListener("click", function(event){
		//deleteWorkout(singleObjectRow.id);
		var deleteRequest = new XMLHttpRequest();
		deleteRequest.open("GET", "http://52.33.123.66:3000/delete?id=" + singleObjectRow.id, true);
		deleteRequest.addEventListener("load", function(){
			var response = deleteRequest.responseText;
			console.log(response);
			displayWorkoutsTable();
		});
		deleteRequest.send(null);
		event.preventDefault();
	});
};

/*
function deleteWorkout(singleObjectRow.id){
	var deleteRequest = new XMLHttpRequest();
		deleteRequest.open("GET", "http://52.33.123.66:3000/delete?id=" + singleObjectRow.id, true);
		deleteRequest.addEventListener("load", function(){
			var response = deleteRequest.responseText;
			console.log(response);
			displayWorkoutsTable();
		});
};
*/

//takes a single cell of table data and adds it to the current row
function addTableRowToDOM(newRow, singleTableItem){
	var cellData = document.createElement("td");
	newRow.appendChild(cellData);
	cellData.textContent = singleTableItem;
}

//#3
function convertWorkoutsToTable(objList){
	/*a function that iterates over a list of objects, 
	calls function number 2, and appends each row to a table body element.
	*/
	for (var i=0; i<objList.results.length; i++){
		convertWorkoutToTableRow(objList.results[i])
	}
}

//#4
function displayWorkoutsTable(){
	//Actually insert all of these construct elements into the DOM
	getWorkouts(function workouts(objectListFromDatabase){
		console.log("objectListFromDatabase is an " + typeof(objectListFromDatabase));
		convertWorkoutsToTable(objectListFromDatabase);
	});
};

	document.getElementById("submit").addEventListener("click", function(event){
		console.log("click is working");
		var insertRequest = new XMLHttpRequest();
		var name = document.getElementById("name").value;
		var reps = document.getElementById("reps").value;
		var weight = document.getElementById("weight").value;
		var date = document.getElementById("date").value;
		var lbs = document.getElementById("lbs").value;
		insertRequest.open("GET", "http://52.33.123.66:3000/insert?", name, reps, weight, date, lbs, true);
		insertRequest.addEventListener("load", function(){
			if (insertRequest.status >= 200 && insertRequest.status < 400){
				var response = insertRequest.response;					
				document.getElementById("response").textContent = response;
			} else {
				console.log("error");
			}
		});
		insertRequest.send(null);
		event.preventDefault();
	});

}; //this closes off main()

