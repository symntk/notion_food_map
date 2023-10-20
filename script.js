const NOTION_SECRET_API_KEY = 'secret_90WLs3xEIHSXJWsXeDq1aYjur5VKVaNYvknBM8mWUFk';
const DATABASE_ID = 'b68d29d34c90466facca12f22e1b9a48';

async function fetchNotionData() {
	const endpoint = `https://api.notion.com/v1/databases/${DATABASE_ID}/query`;
	const response = await fetch(endpoint, {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${NOTION_SECRET_API_KEY}`,
			'Notion-Version': '2021-08-16', // This is the version as of my last update. Check Notion's API documentation for the latest version.
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({}) // Empty body for a simple query
	});

	if (!response.ok) {
		throw new Error('Failed to fetch data from Notion');
	}

	const data = await response.json();
	return data.results; // This will give you the list of pages (rows) in your database
}

// Initialize the map
var map = L.map('map').setView([20, 0], 1);

// Add a base layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Fetch the Notion data
fetchNotionData()
	.then(data => {
		// Convert the Notion data into a more accessible format
		const countryTags = {};
		data.forEach(page => {
			const countryName = page.properties.Country.title[0].plain_text;
			const tag = page.properties.Tag.select.name;
			countryTags[countryName] = tag;
		});

		// Fetch the GeoJSON data from the file
		fetch('countries.geo.json')
			.then(response => response.json())
			.then(country_data => {
				// Add the GeoJSON data to the map
				L.geoJSON(country_data, {
					style: function(feature) {
						const countryName = feature.properties.name; // Assuming the GeoJSON has a 'name' property for each country
						const tag = countryTags[countryName];
						return {
							fillColor: getCountryColor(tag),
							weight: 1,
							opacity: 1,
							color: 'white', // Border color
							fillOpacity: 0.7
						}; // Set the color and weight of the country borders
					},
					onEachFeature: function(feature, layer) {
						layer.bindPopup(feature.properties.name); // Display country name on click
					}
				}).addTo(map);
			})
			.catch(error => {
				console.error("Error fetching the GeoJSON data:", error);
			});
			
	})
	.catch(error => {
		console.error('Error:', error);
	});
