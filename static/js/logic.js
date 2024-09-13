const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Create a map object 
const myMap = L.map("map").setView([37.09, -95.71], 4);

// Add a tile layer 
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors"
}).addTo(myMap);

// Function to determine marker size based on earthquake magnitude
function markerSize(magnitude) {
  return magnitude * 4; 
}

// Function to determine marker color based on earthquake depth
function markerColor(depth) {
  return depth > 90 ? "#ff5f65" :
         depth > 70 ? "#fca35d" :
         depth > 50 ? "#fdb72a" :
         depth > 30 ? "#f7db11" :
         depth > 10 ? "#dcf400" :
                      "#a3f600";
}

// Fetch the GeoJSON data using D3
d3.json(url).then(data => {
  data.features.forEach(feature => {
    const location = feature.geometry;
    const properties = feature.properties;
    const magnitude = properties.mag;
    const depth = location.coordinates[2];

    // Create a circle marker for each earthquake
    L.circleMarker([location.coordinates[1], location.coordinates[0]], {
      radius: markerSize(magnitude),
      fillColor: markerColor(depth),
      color: "#000",
      weight: 0.5,
      opacity: 1,
      fillOpacity: 0.8
    }).bindPopup(`<h3>Location: ${properties.place}</h3><hr><p>Magnitude: ${magnitude}<br>Depth: ${depth}</p>`)
      .addTo(myMap);
  });

  // Add a legend to the map
  const legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    const div = L.DomUtil.create("div", "info legend");
    const depths = [-10, 10, 30, 50, 70, 90];
    const labels = [];

    for (let i = 0; i < depths.length; i++) {
      div.innerHTML +=
        `<i style="background:${markerColor(depths[i] + 1)}"></i> ` +
        depths[i] + (depths[i + 1] ? "&ndash;" + depths[i + 1] + "<br>" : "+");
    }

    return div;
  };

  legend.addTo(myMap);
});