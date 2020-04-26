
// Append username info
let navbar_username = document.getElementById("navbar-username");

// The current user object
let cUser;
let cUserLocation;
let walletid;

let userLat;
let userLong;

if (!navigator.geolocation) {
  console.log("Geolocation API not supported by browser");
} else {
  navigator.geolocation.getCurrentPosition(updateUserLoc);
}

function updateUserLoc (position) {
  userLat = position.coords.latitude;
  userLong = position.coords.longitude;
  console.log(userLat);
  console.log(userLong);
}

// Retrieve the cloud firestore object
let db = firebase.firestore(app);

// Event Listener for DOM user update. Update intro text and update user related variables
firebase.auth().onAuthStateChanged(function(user) {

  // Update the user-related variables
  cUser = user;
  let userEmail = cUser.email;

  // Concatenate the username string from the email
  let username = userEmail.substring(0, userEmail.indexOf("@"));

  navbar_username.innerText = "Welcome back, " + username;

  // Create a new document for the current user
  let cUserDocument = db.collection("users").doc(username);

  // Retrieve user information from the current document query
  cUserDocument.onSnapshot(function(doc) {
      walletid = doc.data().wallet;
      console.log(walletid);
  });

});

document.getElementById("logout").onclick = () => {

  firebase.auth().signOut().then(function() {
    // Sign-out successful, redirect back to the main page (index.html)
    window.location = "index.html";
  }, function(error) {
    // Log any errors
    console.log("Error: " + error);
  });

}

Radar.initialize("prj_live_pk_e26e9849721e36acebb7af3909c6985692c52e43");

// Create the script tag, set the appropriate attributes
var script = document.createElement("script");
script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCmIzUERgQIiesJMiulSvn9ZNTq0GP6aV0&callback=initMap";
script.defer = true;
script.async = true;

// Attach your callback function to the `window` object
window.initMap = function () {

  let map = new google.maps.Map(document.getElementById("map"), {
      center: {lat: userLat, lng: userLong},
      zoom: 12
  });

}

// Append the 'script' element to 'head'
document.head.appendChild(script);
