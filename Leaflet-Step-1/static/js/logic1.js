function createMap(earthquakes) {

  // Create the tile layer that will be the background of our map
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  // Create a baseMaps object to hold the lightmap layer
  var baseMaps = {
    "Light Map": lightmap
  };

  // Create an overlayMaps object to hold the bikeStations layer
  var overlayMaps = {
    "Earthquake data": earthquakes
  };

  // Create the map object with options
  var map = L.map("map", {
    center: [40.73, -74.0059],
    zoom: 5,
    layers: [lightmap, earthquakes]
  });

  // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
  function getColor(d) {

    return d < 1 ? 'rgb(85,255,51)' :

          d < 2  ? 'rgb(221,255,153)' :

          d < 3  ? 'rgb(255,230,102)' :

          d < 4  ? 'rgb(255,213,0)' :

          d < 5  ? 'rgb(255,179,25)' :

          d < 6  ? 'rgb(255,140,25)' :
          'rgb(255,77,77)';
}
  var legend = L.control({position: "bottomright"});
  
  legend.onAdd = function (map) {
  
  
  
        var div = L.DomUtil.create('div', 'info legend'),
  
        grades = [0, 1, 2, 3, 4, 5],
  
        labels = [];
  
  
  
        div.innerHTML+='Magnitude<br><hr>'
  
  
  
        // loop through our density intervals and generate a label with a colored square for each interval
  
        for (var i = 0; i < grades.length; i++) {
  
            div.innerHTML +=
  
                '<i style="background:' + getColor(grades[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
  
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  
    }
  
  
  
    return div;
  
    };
  
  
  
    legend.addTo(map);
}




// Perform an API call to the Citi Bike API to get station information. Call createMarkers when complete
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(data){
createMarkers(data.features);  

}
);
function createMarkers(earthquakedata){
function popups(feature, layer) {
  
layer.bindPopup("<h3>" + feature.properties.place + "<h3><h3>Capacity: " + feature.properties.mag + "<h3>");

}
var earthquakes = L.geoJSON(earthquakedata, {
  onEachFeature: popups,
  pointToLayer: function (feature, latlng) {
    var color;
    var r = 255;
    var r = Math.floor(255-10*feature.properties.mag)

    var g = Math.floor(220-100*feature.properties.mag);

    var b = Math.floor(255-100*feature.properties.mag);
    
    color= "rgb("+r+" ,"+g+","+ b+")"

    if (feature.properties.mag < 1)
      color = 'rgb(85,255,51)'
    else if
       (feature.properties.mag < 2)
      color = 'rgb(221,255,153)'
    else if 
      (feature.properties.mag < 3)
      color = 'rgb(255,230,102)'
     else if 
     (feature.properties.mag < 4)  
     color = 'rgb(255,213,0)'
     else if 
     (feature.properties.mag < 5) 
     color = 'rgb(255,179,25)' 


  

var geojsonMarkerOptions = {
  radius: feature.properties.mag*5,
  fillColor: color,
  color: "#000",
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8
};

  return L.circleMarker(latlng, geojsonMarkerOptions);
  }
});
createMap(earthquakes); 
}