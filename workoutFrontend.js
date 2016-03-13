document.addEventListener("DOMContentLoaded", main);

function main(){
	var req1 = new XMLHttpRequest();
	req1.open("GET", "http://52.33.123.66:3000/", true);
	req1.withCredentials = true;
	req1.addEventListener("load", function(){
		var res = req1.response;
		console.log(typeof(res));
		document.getElementById("response").textContent = res;
		var object = JSON.parse(res);
		var newRow = document.createElement("tr");
		document.getElementsByTagName("tbody").appendChild("newRow");
		for (var i=0; i<object.length; i++){
			var addMe = document.createElement("td");
			document.getElementsByTagName("tbody").appendChild("addMe");
		}
	});
	req1.send(null);

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
