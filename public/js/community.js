
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

// Community needs
let communityNeeds = 0;

Radar.initialize("prj_live_pk_e26e9849721e36acebb7af3909c6985692c52e43");

document.getElementById("content").onclick  = () => {

  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          var xhttpJSON = JSON.parse(this.responseText);
          console.log(xhttpJSON);
      }
  };

  xhttp.open("GET", "https://api.radar.io/v1/search/geofences?near="+userLat+","+userLong, true);
  xhttp.setRequestHeader("Authorization","prj_live_pk_e26e9849721e36acebb7af3909c6985692c52e43");
  xhttp.send();

  var xhttpUsers = new XMLHttpRequest();

  xhttpUsers.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          var xhttpUsersJSON = JSON.parse(this.responseText);
          var usersInGeoFence = xhttpUsersJSON.users;
          for (var i = 0; i < usersInGeoFence.length; i++) {
            communityNeeds += usersInGeoFence[i].Requested;
          }
      }
  };

  xhttpUsers.open("GET", "https://api.radar.io/v1/geofences/:id/users", true);
  xhttpUsers.setRequestHeader("Authorization","prj_live_sk_ad4fd76ab85ed0c100cd39fe0b42a9e939fac017");
  xhttpUsers.send();

}

// Create the script tag, set the appropriate attributes
var script = document.createElement("script");
script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCmIzUERgQIiesJMiulSvn9ZNTq0GP6aV0&callback=initMap";
script.defer = true;
script.async = true;

var popup, Popup;

// Attach your callback function to the `window` object
window.initMap = function () {

  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          var xhttpJSON = JSON.parse(this.responseText);
          console.log(xhttpJSON);
      }
  };

  xhttp.open("GET", "https://api.radar.io/v1/search/geofences?near="+userLat+","+userLong, true);
  xhttp.setRequestHeader("Authorization","prj_live_pk_e26e9849721e36acebb7af3909c6985692c52e43");
  xhttp.send();

  var xhttpUsers = new XMLHttpRequest();

  xhttpUsers.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          var xhttpUsersJSON = JSON.parse(this.responseText);
          var usersInGeoFence = xhttpUsersJSON.users;
          for (var i = 0; i < usersInGeoFence.length; i++) {
            communityNeeds += usersInGeoFence[i].Requested;
          }
      }
  };

  xhttpUsers.open("GET", "https://api.radar.io/v1/geofences/:id/users", true);
  xhttpUsers.setRequestHeader("Authorization","prj_live_sk_ad4fd76ab85ed0c100cd39fe0b42a9e939fac017");
  xhttpUsers.send();

  let map = new google.maps.Map(document.getElementById("map"), {
      center: {lat: userLat, lng: userLong},
      zoom: 12
  });


  var titlenode = document.createElement("h6");
  var titletextnode = document.createTextNode("Your Community");
  titlenode.style.fontWeight = "600";
  titlenode.style.marginLeft = "-7.5vw";
  titlenode.style.marginTop = "1vh";
  titlenode.appendChild(titletextnode);

  document.getElementById("content-text-container").appendChild(titlenode);

  var donationnode = document.createElement("p");
  var donationtextnode = document.createTextNode("\nDonations Needed: $" + communityNeeds);
  donationnode.style.marginLeft = "-8.75vw";
  donationnode.appendChild(donationtextnode);

  document.getElementById("content-text-container").appendChild(donationnode);

  var ctx = document.getElementById('chart').getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Friday', 'Saturday', 'Today'],
      datasets: [{
        label: 'Donations',
        data: [30, 20, 40],
        backgroundColor: [
          'rgba(99, 255, 132, 0.2)',
          'rgba(99, 255, 132, 0.2)',
          'rgba(99, 255, 132, 0.2)',
        ],
        borderColor: [
          'rgba(99, 255, 132, 1)',
          'rgba(99, 255, 132, 1)',
          'rgba(99, 255, 132, 1)'
        ],
        borderWidth: 1,
        barThickness: 35
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });

  Popup = createPopupClass();
  popup = new Popup(
      new google.maps.LatLng(userLat, userLong),
      document.getElementById('content'));
  popup.setMap(map);

  var communityCoords = [
          {lat: userLat - 0.005, lng: userLong - 0.01},
          {lat: userLat + 0.0075, lng: userLong - 0.01},
          {lat: userLat + 0.0075, lng: userLong + 0.01},
          {lat: userLat - 0.005, lng: userLong + 0.01}
        ];

  var userCommunity = new google.maps.Polygon({
    paths: communityCoords,
    strokeColor: '#05ff76',
    strokeOpacity: 0.8,
    strokeWeight: 3,
    fillColor: '#42f593',
    fillOpacity: 0.35
  });

  userCommunity.onclick = () => {
    consoel.log("Hi");
  }

  userCommunity.setMap(map);

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
