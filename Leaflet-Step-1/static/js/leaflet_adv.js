 // Store API endpoint as queryUrl
 var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  
 var platesPath = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";
   

//size of magnitude
 function getRadius(magnitude){
    if (magnitude===0){
      return 1;
    }
    return magnitude * 4;
  }

//define different color for different size
function getColor(magnitude){
    switch (true) {
      case magnitude > 5:
        return "#ea2c2c";
      case magnitude > 4:
        return "#ea822c";
      case magnitude > 3:
        return "#ee9c00";
      case magnitude > 2:
        return "#eecc00";
      case magnitude > 1:
        return "#d4ee00";
      default:
        return "#98ee00";
      }
   }
//Creating different layers of the map
var attribution = "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>";
  
var satelliteMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: attribution,
  maxZoom: 18,
  id: "mapbox.satellite",
  accessToken: API_KEY
});

var lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: attribution,
  maxZoom: 18,
  id: "light-v10",
  accessToken: API_KEY
});

var outdoorsMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: attribution,
  maxZoom: 18,
  id: "outdoors-v11",
  accessToken: API_KEY
});

// Create a baseMaps object
var baseMaps = {
  "Satellite": satelliteMap,
  "Grayscale": lightMap,
  "Outdoors": outdoorsMap
};

  
// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
    d3.json(platesPath, function(platesData) {
  
      // console.log(data.features);
      console.log(platesData);

          // Earthquake layer
    var earthquakes = L.geoJSON(data, {

        // Create circle markers
        pointToLayer: function (feature, latlng) {
          var geojsonMarkerOptions = {
            radius: 8,
            stroke: false,
            radius: getRadius(feature.properties.mag),
            fillColor: getColor(feature.properties.mag),
            weight: 5,
            opacity: .8,
            fillOpacity: .8
          };
          return L.circleMarker(latlng, geojsonMarkerOptions);
        },
  
        // Create popups
        onEachFeature: function (feature, layer) {
          return layer.bindPopup(`<strong>Place:</strong> ${feature.properties.place}<br><strong>Magnitude:</strong> ${feature.properties.mag}`);
        }
      });

          // Tectonic plates layer
    var platesStyle = {
        "color": "orange",
        "weight": 2,
        "opacity": 1,
        fillOpacity: 0,
      };
      var plates = L.geoJSON(platesData, {
        style: platesStyle
      });
  
      // Create an overlay object
      var overlayMaps = {
        "Fault lines": plates,
        "Earthquakes": earthquakes,
      };
  
      // Define a map object
      var map = L.map("map", {
        center: [37.09, -95.71],
        zoom: 3,
        layers: [satelliteMap, plates, earthquakes]
      });
  
      // Add the layer control to the map
      L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
      }).addTo(map);
  
      
      var legend = L.control({position: 'bottomright'});

      legend.onAdd = function (map) {
      
          var div = L.DomUtil.create('div', 'info legend');
              var grades = [0, 1, 2, 3, 4, 5];
              var colors = [
                     "#98ee00",
                     "#d4ee00",
                     "#eecc00",
                     "#ee9c00",
                     "#ea822c",
                     "#ea2c2c"
                   ];
      
          // loop through our density intervals and generate a label with a colored square for each interval
          for (var i = 0; i < grades.length; i++) {
              div.innerHTML +=
                  '<i style="background:' + colors[i] + '"></i> ' +
                  grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
          }
      
          return div;
      };
      
  
      // Adding legend to the map
      legend.addTo(map);
  
    })
  })