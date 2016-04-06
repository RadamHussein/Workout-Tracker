/*Workout Tracker
Adam Smith
CS290 - Winter 2016
*/

//document.addEventListener("DOMContentLoaded", displayWorkoutsTable);
document.addEventListener("DOMContentLoaded", main);

function main(){
	displayWorkoutsTable();
	handleInsert();

//gets any table data from database 
function getWorkouts(workouts){
	//calls get and returns a list of objects
	var request = new XMLHttpRequest();
	request.open("GET", "http://52.33.123.66:3000/", true);
	request.withCredentials = true;
	request.addEventListener("load", function(){
		var response = request.responseText;
		var objectListFromDatabase = JSON.parse(response); //change it to an object
		console.log(typeof(objectListFromDatabase)); //did it change to an object?
		workouts(objectListFromDatabase); // Call the callback provided by the caller
	});
	request.send(null);
};

//add workouts to the table
function convertWorkoutToTableRow(singleObjectRow){

	//get cell data from each element in the object and add to DOM
	var newRow = document.createElement("tr");
	document.getElementById("tableBody").appendChild(newRow);
	
	//cut the time off the end of the date
	var formattedDate = singleObjectRow.date.slice(0, 10);

	//check value of lbs and convert to string to display in table
	if (singleObjectRow.lbs === 1){
		var lbs = "lbs";
	}
	else {
		var lbs = "kg";
	}

	//send to function to add entry to table
	addTableRowToDOM(newRow, singleObjectRow.name);
	addTableRowToDOM(newRow, singleObjectRow.reps);
	addTableRowToDOM(newRow, singleObjectRow.weight);
	addTableRowToDOM(newRow, formattedDate);
	addTableRowToDOM(newRow, lbs);

	//create buttons
	var cellForButtons = document.createElement("td");
	newRow.appendChild(cellForButtons);
	//add id="edit" if no other way to isolate button
	var buttonForModal = '<button type="button" class="btn btn-info" data-toggle="modal" data-target=".bs-example-modal-lg">Edit</button>';
	cellForButtons.innerHTML = buttonForModal;

	//var editButton = document.getElementById("Edit");
	var editButton = cellForButtons.firstElementChild;
	editButton.addEventListener("click", function(event){
		console.log("edit button working");
		console.log(singleObjectRow.name);
		console.log(singleObjectRow.reps);
		console.log(singleObjectRow.weight);
		document.getElementById("name-modal").textContent = singleObjectRow.name;
		document.getElementById("reps-modal").textContent = singleObjectRow.reps;
		document.getElementById("weight-modal").textContent = singleObjectRow.weight;
		event.preventDefault();
	});

	var deleteButton = document.createElement("button");
	deleteButton.id = "Delete";
	deleteButton.className = "btn btn-danger";
	cellForButtons.appendChild(deleteButton);
	deleteButton.textContent = "Delete";
	deleteButton.addEventListener("click", function(event){
		console.log("delete button clicked");
		var deleteRequest = new XMLHttpRequest();
		deleteRequest.open("GET", "http://52.33.123.66:3000/delete?id=" + singleObjectRow.id, true);
		deleteRequest.addEventListener("load", function(){
			var response = deleteRequest.responseText;
			console.log(response);
			resetTable();
			displayWorkoutsTable();
		});
		deleteRequest.send(null);
		event.preventDefault();
	});
};

//this function clears the table so that a new one can be built after a change
function resetTable(){
	var newTableBody = document.createElement("tbody");
	var oldTableBody = document.getElementById("tableBody");
	oldTableBody.parentNode.replaceChild(newTableBody, oldTableBody);
	newTableBody.id = "tableBody";
}

//takes a single cell of table data and adds it to the current row
function addTableRowToDOM(newRow, singleTableItem){
	var cellData = document.createElement("td");
	newRow.appendChild(cellData);
	cellData.textContent = singleTableItem;
}

//iterates through data returned form mysql and send individual objects to be added to table.
function convertWorkoutsToTable(objList){
	for (var i=0; i<objList.results.length; i++){
		convertWorkoutToTableRow(objList.results[i])
	}
}

//gets called first. Calls getWorkouts and calls converWorkoutsToTable with results;
function displayWorkoutsTable(){
	//Actually insert all of these construct elements into the DOM
	getWorkouts(function workouts(objectListFromDatabase){
		console.log("objectListFromDatabase is an " + typeof(objectListFromDatabase));
		convertWorkoutsToTable(objectListFromDatabase);
	});
};

//This is a function to seperate the handling of Insert. It 
function handleInsert(){
	document.getElementById("submit").addEventListener("click", function(event){
		console.log("click is working");
		var insertRequest = new XMLHttpRequest();
		var name = document.getElementById("name").value;
		var reps = document.getElementById("reps").value;
		var weight = document.getElementById("weight").value;
		var lbs = document.getElementById("lbs").value;
		var date = document.getElementById("date").value;

		insertRequest.open("GET", "http://52.33.123.66:3000/insert?name=" + name + "&reps=" + reps + "&weight=" + weight + "&date=" + date + "&lbs=" + lbs, true);
		insertRequest.addEventListener("load", function(event){
			if (insertRequest.status >= 200 && insertRequest.status < 400){
				var response = insertRequest.responseText;
				console.log(response);
				resetTable();
				displayWorkoutsTable();			
			} else {
				console.log("error");
			}
		});
		insertRequest.send(null);
		event.preventDefault();
	});
};

}; //this closes off main()

