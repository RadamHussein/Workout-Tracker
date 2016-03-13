document.addEventListener("DOMContentLoaded", main);

function main(){
	var req1 = new XMLHttpRequest();
	req1.open("GET", "http://52.33.123.66:3000/", true);
	req1.withCredentials = true;
	req1.addEventListener("load", function(){
		var res = req1.response;
		console.log(res);
		document.getElementById("response").textContent = res;
	});
	req1.send(null);


document.getElementById("add").addEventListener("click", function(event){
		console.log("click is working");
		var name = document.getElementById("name").value;
		var req = new XMLHttpRequest();
		req.open("GET", "http://52.33.123.66:3000/insert", name, reps, weight, date, lbs, true);
		req.addEventListener("load", function(){
			if (req.status >= 200 && req.status < 400){
				var res = req.response;					
				document.getElementById("response").textContent = res;
			} else {
				console.log("error");
			}
		});
		req.send(null);
		event.preventDefault();
	});
	event.preventDefault();
};
