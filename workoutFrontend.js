document.addEventListener("DOMContentLoaded", main);

function main(){
	var req = new XMLHttpRequest();
	req.open("GET", "http://52.33.123.66:3000/", true);
	req.addEventListener("load", function(){
		var res = req.response;
		console.log(res);
		document.getElementById("response").textContent = res;
	});
	req.send(null);


document.getElementById("add").addEventListener("click", function(event){
		console.log("click is working");
		var name = document.getElementById("name").value;
		var req = new XMLHttpRequest();
		req.open("GET", "http://52.33.123.66:3000/insert", name, reps, weight, date, lbs, true);
		req.addEventListener("load", function(){
			var res = req.response;					
			document.getElementById("response").textContent = res;
		});
		req.send(null);
		event.preventDefault();
	});
};
