document.addEventListener("DOMContentLoaded", bindButtons);

function bindButtons(){
	var logInButton = document.getElementById("login");

	logInButton.addEventListener("click", function(event){
		console.log("Log In button clicked");
		var username = document.getElementById("username").value;
		var password = document.getElementById("password").value;
		var params = "user_name=" + username + "&password=" + password;
		var logInRequest = new XMLHttpRequest();
		logInRequest.open("POST", "http://52.33.123.66:2000/logIn", true);
		logInRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		logInRequest.addEventListener("load", function(event){
			var goodResponse = true;
			if (logInRequest.status >= 200 && logInRequest.status < 400){
				var response = logInRequest.responseText;
				console.log(response);		
			} else {
				console.log("error");
				goodResponse = false;
			}
		});
		logInRequest.send(params);
		event.preventDefault();
		if(goodResponse == true){
			window.open("http://52.33.123.66:2000/workout.html");
		}
	});
};
