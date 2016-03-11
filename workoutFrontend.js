/*
var ec2 = new AWS.EC2({region: 'us-west-2'});
 
ec2.describeInstances(function(err, data) {
  if (err) {
    console.log(err);
  } else {
    data.Reservations.forEach(function(reservation) {
      reservation.Instances.forEach(function(instance) {
        console.log(instance.InstanceId);
      });
    });
  }
});
*/
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
		req.open("GET", "http://52.33.123.66:3000/insert", name, true);
		req.addEventListener("load", function(){
			var res = req.response;					
			document.getElementById("response").textContent = res;
		});
		event.preventDefault();
	});
};


/*
// Create the XHR object.
function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
    // XHR for Chrome/Firefox/Opera/Safari.
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest != "undefined") {
    // XDomainRequest for IE.
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    // CORS not supported.
    xhr = null;
  }
  return xhr;
}

// Helper method to parse the title tag from the response.
function getTitle(text) {
  return text.match('<title>(.*)?</title>')[1];
}

// Make the actual CORS request.
function makeCorsRequest() {
  // All HTML5 Rocks properties support CORS.
  var url = "http://52.33.123.66:3000/";

  var xhr = createCORSRequest('GET', url);
  if (!xhr) {
    alert('CORS not supported');
    return;
  }

  // Response handlers.
  xhr.onload = function() {
    var text = xhr.responseText;
    var title = getTitle(text);
    alert('Response from CORS request to ' + url + ': ' + title);
  };

  xhr.onerror = function() {
    alert('Woops, there was an error making the request.');
  };

  xhr.send();
}
*/