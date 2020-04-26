
// Retrieve the cloud firestore object
let db = firebase.firestore(app);

let userGeoPoint;

let userLat;
let userLong;

if (!navigator.geolocation) {
  console.log("Geolocation API not supported by browser");
} else {
  navigator.geolocation.getCurrentPosition(updateUserLoc);
}

function updateUserLoc (position) {
  userGeoPoint = position;
  userLat = position.coords.latitude;
  userLong = position.coords.longitude;
  console.log(userLat);
  console.log(userLong);
}

// Create a new event listener that checks for the submit function (enter key)
document.onkeyup = function(e) {

  // Enter key, submit authentication results (username, password) to firebase
  if (e.which == 13) {

    // Retrieve the email and password information off the index.html page
    let username = document.querySelector('#username').value;
    let password = document.querySelector('#password').value;
    let walletid = document.querySelector('#wallet').value;

    e.preventDefault();
    e.stopPropagation();

    firebase.auth().createUserWithEmailAndPassword(username, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
    })

    let nusername = user.email.substring(0, user.email.indexOf("@"));

    // Create a new document for the current user
    let cUserDocument = db.collection("users").doc(nusername).set({
      username: nusername,
      location: {
        lat: userLat,
        lng: userLong
      },
      wallet: walletid,
    });

  }

}

// Firebase listener for html page redirection
firebase.auth().onAuthStateChanged(function(user) {
    if (user !== null) {
      window.location = "community.html";
    }
});
