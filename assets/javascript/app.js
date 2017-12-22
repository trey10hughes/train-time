$(function(){

// Initialize Firebase
  var config = {
    apiKey: "AIzaSyBdtFYMko3q7WUktpfrGVMIhE-631vAlFg",
    authDomain: "train-time-3f3b0.firebaseapp.com",
    databaseURL: "https://train-time-3f3b0.firebaseio.com",
    projectId: "train-time-3f3b0",
    storageBucket: "",
    messagingSenderId: "910368069914"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

$("#add-train").on("click", function(){	

	console.log("button clicked");
	var name = $("#name-input").val().trim();
	var destination = $("#destination-input").val().trim();
	var firstTrainTime = moment($("#first-time-input").val().trim(), "HH:mm").format("HH:mm");
	var frequency = $("#frequency-input").val().trim();

	var train = {
			name: name,
			destination: destination,
			firstTrainTime: firstTrainTime,
			frequency: frequency
		}

	console.log("new train created: " + train);

	database.ref().push(train);
	console.log("pushed new train to firebase");

});

database.ref().on("child_added", function(snapshot) {

	//calculate the values for next arrival time and minutes away using moment.js
	var tFrequency = snapshot.val().frequency;
	var firstTime = snapshot.val().firstTrainTime;

	//first time
	var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");

	//current time
	var currentTime = moment();

	//difference between times
	var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

	//time apart
	var tRemainder = diffTime % tFrequency;

	//minutes till next train
	var tMinutesTillTrain = tFrequency - tRemainder;

	//next train time
	var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("HH:mm");



	var $tableRow = $("<tr>"); //create a blank table row

	$tableRow.append("<td>" + snapshot.val().name + "</td>");
	$tableRow.append("<td>" + snapshot.val().destination + "</td>");
	$tableRow.append("<td>" + snapshot.val().frequency + "</td>"); 
	$tableRow.append("<td>" + nextTrain + "</td>");
	$tableRow.append("<td>" + tMinutesTillTrain + "</td>"); 
	//append <td> elements with values from the snapshot to the $tableRow
	$("tbody").append($tableRow);  
}, function(errorObject) {
  console.log("The read failed: " + errorObject.code);
});

});
