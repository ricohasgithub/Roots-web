
// Append username info
let navbar_username = document.getElementById("navbar-username");

// The current user object
let cUser;

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

  // Append user information to the current document query
  

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
