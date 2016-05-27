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
				//check if the response sent back is true
				if(response == '{"results":true}'){
					window.open("http://52.33.123.66:2000/workout.html");
					//self.close();
				}
			} else {
				console.log("error");
			}
			return goodResponse;
		});
		logInRequest.send(params);
		event.preventDefault();
	});

	//this function executes code for updating an entry when a modal is shown
	$('#new-user').on('show.bs.modal', function(event){
		var modal = $(this);
		console.log('Modal is shown');
		modal.find("#submit-modal").on('click', function(event){
			createNewUser();
			console.log("Submit Clicked");
		});
	});

	//removes event listener from modal once modal is hidden
	$('#new-user').on('hide.bs.modal', function(event){
		$('#submit-modal').off();
	});
};

function createNewUser(){
		var fname = document.getElementById("first_name-modal").value;
		var lname = document.getElementById("last_name-modal").value;
		var username = document.getElementById("user_name-modal").value;
		var password = document.getElementById("password-modal").value;
		var params = "first_name=" + fname + "&last_name=" + lname + "&user_name=" + username + "&password=" + password;
		var insertRequest = new XMLHttpRequest();

		insertRequest.open("POST", "http://52.33.123.66:2000/insertUser", true);
		insertRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		insertRequest.addEventListener("load", function(event){
			if (insertRequest.status >= 200 && insertRequest.status < 400){
				var response = insertRequest.responseText;
				console.log(response);
			} else {
				console.log("error");
			}
		});
		insertRequest.send(params);
};
