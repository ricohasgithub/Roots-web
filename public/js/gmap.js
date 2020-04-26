
// Create the script tag, set the appropriate attributes
var script = document.createElement("script");
script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCmIzUERgQIiesJMiulSvn9ZNTq0GP6aV0&callback=initMap";
script.defer = true;
script.async = true;

// Attach your callback function to the `window` object
window.initMap = function () {

  let map = new google.maps.Map(document.getElementById("map"), {
      center: {lat: 43.4675, lng: -79.687},
      zoom: 12
  });

}

// Append the 'script' element to 'head'
document.head.appendChild(script);
