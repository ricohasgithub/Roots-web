
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
