
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

var popup, Popup;

// Attach your callback function to the `window` object
window.initMap = function () {

  let map = new google.maps.Map(document.getElementById("map"), {
      center: {lat: userLat, lng: userLong},
      zoom: 12
  });

  let marker = new google.maps.Marker({
    position: {lat: userLat, lng: userLong},
    map: map,
    title: 'You are here'
  });
  Popup = createPopupClass();
  popup = new Popup(
      new google.maps.LatLng(userLat, userLong),
      document.getElementById('content'));
  popup.setMap(map);

}

function createPopupClass() {

  function Popup(position, content) {
    this.position = position;

    content.classList.add('popup-bubble');

    // This zero-height div is positioned at the bottom of the bubble.
    var bubbleAnchor = document.createElement('div');
    bubbleAnchor.classList.add('popup-bubble-anchor');
    bubbleAnchor.appendChild(content);

    // This zero-height div is positioned at the bottom of the tip.
    this.containerDiv = document.createElement('div');
    this.containerDiv.classList.add('popup-container');
    this.containerDiv.appendChild(bubbleAnchor);

    // Optionally stop clicks, etc., from bubbling up to the map.
    google.maps.OverlayView.preventMapHitsAndGesturesFrom(this.containerDiv);
  }
  // ES5 magic to extend google.maps.OverlayView.
  Popup.prototype = Object.create(google.maps.OverlayView.prototype);

  /** Called when the popup is added to the map. */
  Popup.prototype.onAdd = function() {
    this.getPanes().floatPane.appendChild(this.containerDiv);
  };

  /** Called when the popup is removed from the map. */
  Popup.prototype.onRemove = function() {
    if (this.containerDiv.parentElement) {
      this.containerDiv.parentElement.removeChild(this.containerDiv);
    }
  };

  /** Called each frame when the popup needs to draw itself. */
  Popup.prototype.draw = function() {
    var divPosition = this.getProjection().fromLatLngToDivPixel(this.position);

    // Hide the popup when it is far out of view.
    var display =
        Math.abs(divPosition.x) < 4000 && Math.abs(divPosition.y) < 4000 ?
        'block' :
        'none';

    if (display === 'block') {
      this.containerDiv.style.left = divPosition.x + 'px';
      this.containerDiv.style.top = divPosition.y + 'px';
    }
    if (this.containerDiv.style.display !== display) {
      this.containerDiv.style.display = display;
    }
  };

  return Popup;
}


// Append the 'script' element to 'head'
document.head.appendChild(script);
