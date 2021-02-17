// Create the tile layer that will be the background of our map
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 20,
  id: "light-v10",
  accessToken: API_KEY
});

// Initialize all of the LayerGroups we'll be using
var layers = {
  SQUIRREL_APPROACH: new L.LayerGroup(),
  SQUIRREL_CHASE: new L.LayerGroup(),
  SQUIRREL_CLIMBING: new L.LayerGroup(),
  SQUIRREL_EATING: new L.LayerGroup(),
  SQUIRREL_RUNNING: new L.LayerGroup(),
  SQUIRREL_OTHER: new L.LayerGroup()
};



// Create the map with our layers
var map = L.map("map-id", {
    center: [40.785091, -73.968285],
    zoom: 14.5,
    layers: [
      layers.SQUIRREL_APPROACH,
      layers.SQUIRREL_CHASE,
      layers.SQUIRREL_CLIMBING,
      layers.SQUIRREL_EATING,
      layers.SQUIRREL_RUNNING,
      layers.SQUIRREL_OTHER,
    ]
});

// Add our 'lightmap' tile layer to the map
lightmap.addTo(map);

// Create an overlays object to add to the layer control
var overlays = {
  "Approaching": layers.SQUIRREL_APPROACH,
  "Chasing": layers.SQUIRREL_CHASE,
  "Climbing": layers.SQUIRREL_CLIMBING,
  "Eating": layers.SQUIRREL_EATING,
  "Running": layers.SQUIRREL_RUNNING,
  "Other": layers.SQUIRREL_OTHER
};

// Create a control for our layers, add our overlay layers to it
L.control.layers(null, overlays).addTo(map);

// Create a legend to display information about our map
var info = L.control({
  position: "topright"
});

// When the layer control is added, insert a div with the class of "legend"
info.onAdd = function() {
  var div = L.DomUtil.create("div", "legend");
  return div;
};

// Add the info legend to the map
info.addTo(map);

// Initialize an object containing icons for each layer group
var icons = {
  SQUIRREL_APPROACH: L.ExtraMarkers.icon({
    icon: "ion-ios-search",
    iconColor: "cyan",
    markerColor: "cyan",
    shape: "square"
  }),
  SQUIRREL_CHASE: L.ExtraMarkers.icon({
    icon: "ion-android-open",
    iconColor: "red",
    markerColor: "red",
    shape: "square"
  }),
  SQUIRREL_CLIMBING: L.ExtraMarkers.icon({
    icon: "ion-leaf",
    iconColor: "blue",
    markerColor: "blue-dark",
    shape: "square"
  }),
  SQUIRREL_EATING: L.ExtraMarkers.icon({
    icon: "ion-android-restaurant",
    iconColor: "green",
    markerColor: "green",
    shape: "square"
  }),
  SQUIRREL_RUNNING: L.ExtraMarkers.icon({
    icon: "ion-ios-paw",
    iconColor: "orange",
    markerColor: "orange",
    shape: "square"
  }),
  SQUIRREL_OTHER: L.ExtraMarkers.icon({
      icon: "ion-aperture",
      iconColor: "purple",
      markerColor: "purple",
      shape: "square"
  }),
};



// Perform call to raw web API endpoint
d3.json("/raw-web-api", function (mydata) {
  response = mydata
  
  console.log(response)

  // Initialize a squirrel status code that will allow us to access the layers and icons
  var squirrel_status;
  // Loop through the stations (they're the same size and have partially matching data)
  for (var i = 0; i < response.length; i++) {
  // Create a new station object with properties of both station objects
      if (response[i].approaches == "True") {
        squirrel_status = "SQUIRREL_APPROACH"; 
      }
      else if (response[i].chasing == "True") {
        squirrel_status = "SQUIRREL_CHASE";
      }
      else if (response[i].climbing == "True") {
        squirrel_status = "SQUIRREL_CLIMBING";
      }
      else if (response[i].eating == "True") {
        squirrel_status = "SQUIRREL_EATING";
      }
      else if (response[i].running == "True") {
        squirrel_status = "SQUIRREL_RUNNING";
      }
      else {
        squirrel_status = "SQUIRREL_OTHER";
      }

      console.log(squirrel_status)
      var location = response[i].geocoded_column;
      
      // Create a new marker with the appropriate icon and coordinates
      var newMarker = L.marker([location.coordinates[1], location.coordinates[0]], {
        icon: icons[squirrel_status]
      });

      // // Add the new marker to the appropriate layer
      newMarker.addTo(layers[squirrel_status]);

      // Bind a popup to the marker that will  display on click. This will be rendered as HTML
      newMarker.bindPopup(squirrel_status);
     }

});
