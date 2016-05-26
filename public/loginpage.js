document.addEventListener("DOMContentLoaded", bindButtons);

function bindButtons(){
	var logInButton = document.getElementById("login");

	logInButton.addEventListener("click", function(event){
		console.log("Log In button clicked");
	/*
		var username = document.getElementById("username").value;
		var password = document.getElementById("password").value;
		var params = "user_name=" + username + "&password=" + password;
		var logInRequest = new XMLHttpRequest();
		logInRequest.open("POST", "http://52.33.123.66:2000/logIn", true);
		logInRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		logInRequest.addEventListener("load", function(event){
			if (insertRequest.status >= 200 && insertRequest.status < 400){
				var response = logInRequest.responseText;
				console.log(response);		
			} else {
				console.log("error");
			}
		});
		logInRequest.send(params);
	*/
		event.preventDefault();
	});
};
