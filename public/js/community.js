
// Append username info
let navbar_username = document.getElementById("navbar-username");

// The current user object
let cUser;

// Event Listener for DOM user update. Update intro text and update user related variables
firebase.auth().onAuthStateChanged(function(user) {

  // Update the user-related variables
  cUser = user;
  let userEmail = cUser.email;

  // Concatenate the username string from the email
  let username = userEmail.substring(0, userEmail.indexOf("@"));

  navbar_username.innerText = "Welcome back, " + username;

});

Radar.initialize("prj_live_pk_e26e9849721e36acebb7af3909c6985692c52e43");
