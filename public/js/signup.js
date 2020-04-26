
// Create a new event listener that checks for the submit function (enter key)
document.onkeyup = function(e) {

  // Enter key, submit authentication results (username, password) to firebase
  if (e.which == 13) {

    // Retrieve the email and password information off the index.html page
    let username = document.querySelector('#username').value;
    let password = document.querySelector('#password').value;

    e.preventDefault();
    e.stopPropagation();

    firebase.auth().createUserWithEmailAndPassword(username, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
    })

  }

}

// Firebase listener for html page redirection
firebase.auth().onAuthStateChanged(function(user) {
    if (user !== null) {
      window.location = "document.html";
    }
});
