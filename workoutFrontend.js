/*Workout Tracker
Adam Smith
CS290 - Winter 2016
*/

document.addEventListener("DOMContentLoaded", displayWorkoutsTable);

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
	/*
	for (var item in singleObjectRow){
		var cellData = document.createElement("td");
		newRow.appendChild(cellData); 
		cellData.textContent = item;
	}
	*/
	for (var i=o; i<singleObjectRow.length; i++){
		var cellData = document.createElement("td");
		newRow.appendChild(cellData);
		cellData.textContent = singleObjectRow[i];
	}
};

//#3
function convertWorkoutsToTable(objList){
	/*a function that iterates over a list of objects, 
	calls function number 2, and appends each row to a table body element.
	*/
	console.log("objList in function 3 is " + typeof(objList));
	/*nested loop because the list will always contain objects.
	First loop gets the object from the list. Second loop iterates over
	the properties of the object.
	*/
	/*
	for (var prop in objList){
		console.log("prop is a " + typeof(prop) + "and its value is " + prop);
		for (var item in prop){
			console.log("item is a " + typeof(item) + "and its value is " + item);
			convertWorkoutToTableRow(item);
		}
	}
	*/

	for (var i=0; i<objList.length; i++){
		convertWorkoutToTableRow(objList[i]);
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

/*
	document.getElementById("add").addEventListener("click", function(event){
		console.log("click is working");
		var name = document.getElementById("name").value;
		var req2 = new XMLHttpRequest();
		req2.open("GET", "http://52.33.123.66:3000/insert", name, reps, weight, date, lbs, false);
		req2.addEventListener("load", function(){
			if (req2.status >= 200 && req.status < 400){
				var res = req2.response;					
				document.getElementById("response").textContent = res;
			} else {
				console.log("error");
			}
		});
		req2.send(null);
		event.preventDefault();
	});
	event.preventDefault();
};
*/
