/*Workout Tracker
Adam Smith
CS290 - Winter 2016
*/

document.addEventListener("DOMContentLoaded", main);

function main(){
	var req1 = new XMLHttpRequest();
	req1.open("GET", "http://52.33.123.66:3000/", true);
	req1.withCredentials = true;
	req1.addEventListener("load", function(){
		var res = req1.responseText;
		document.getElementById("response").textContent = res;
		var obj = JSON.parse(res); //change it to an object
		console.log(typeof(obj)); //did it change to an object?
		var newRow = document.createElement("tr");
		document.getElementById("tableBody").appendChild(newRow);
		buildTable(obj);
/*
		for (var i=0; i<obj.length; i++){
			for (var x=0; x<obj[i].length; x++){
				var addMe = document.createElement("td");
				document.getElementById("tableBody").appendChild(addMe);
				var nestedObj = obj[i]; 
				addMe.textContent = nestedObj[x];
			}
		}
*/
	});
	req1.send(null);

	function buildTable(obj){
    	for(var prop in obj){
        	if(typeof obj[prop]=='object'){
            	buildTable(obj[prop[prop]]);
        	}else{
            	var addMe = document.createElement("td");
            	document.getElementById("tableBody").appendChild(addMe);
            	addMe.textContent = obj[prop];
            	//alert('The value of '+prop+' is '+obj[prop]+'.');
        	}
    	}
	}

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
