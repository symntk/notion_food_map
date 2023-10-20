// Initialize the map
var map = L.map('map').setView([20, 0], 2);

// Add a base layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Sample GeoJSON data for countries (you'd replace this with your full dataset)
var countries = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "name": "Canada",
                "notionLink": "https://www.notion.so/CanadaPage"
                // Add other properties like tags or colors based on your Notion database
            },
            "geometry": {
                "type": "Polygon",
                // Sample coordinates, you'd replace with actual coordinates
                "coordinates": [[[...]]]
            }
        },
        // ... other countries
    ]
};

// Add countries to the map
L.geoJSON(countries, {
    style: function(feature) {
        // Style countries based on properties (e.g., color based on tags)
        return {color: "#ff7800", weight: 1};
    },
    onEachFeature: function(feature, layer) {
        // Make each country clickable
        layer.on('click', function() {
            window.location.href = feature.properties.notionLink;
        });
    }
}).addTo(map);
