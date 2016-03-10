document.addEventListener("DOMContentLoaded", main);

function main(){
	var req = new XMLHttpRequest();
	req.open("GET", "http://52.33.123.66:3000/");
	var res = req.response;
	console.log(res);
	console.log("prove that this front end is working");
	document.getElementById("response").textContent = "prove that this works";
}