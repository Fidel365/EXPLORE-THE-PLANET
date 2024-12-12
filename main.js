document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded and parsed");

    /** Leaflet Map Setup **/
    const map = L.map('map').setView([51.505, -0.09], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Add Marker on Click with Weather Info
    map.on('click', async function (e) {
        const { lat, lng } = e.latlng;

        // Fetch Weather Data
        const apiKey = 'your_openweathermap_api_key'; // Use your API key from OpenWeatherMap
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`;

        let weatherInfo = 'Weather data unavailable';
        try {
            const response = await fetch(weatherUrl);
            if (response.ok) {
                const weather = await response.json();
                weatherInfo = `
                    <b>Weather:</b> ${weather.weather[0].description}<br>
                    <b>Temperature:</b> ${weather.main.temp} °C<br>
                    <b>Humidity:</b> ${weather.main.humidity}%<br>
                    <b>Wind Speed:</b> ${weather.wind.speed} m/s
                `;
            }
        } catch (error) {
            console.error("Error fetching weather data:", error);
        }

        // Add Marker with Popup
        const marker = L.marker([lat, lng]).addTo(map);
        marker.bindPopup(`Location: ${lat.toFixed(2)}, ${lng.toFixed(2)}<br>${weatherInfo}`).openPopup();
    });

    // Search Bar for Location
    const searchBox = L.control({ position: 'topleft' });
    searchBox.onAdd = function () {
        const input = L.DomUtil.create('input', '');
        input.type = 'text';
        input.placeholder = 'Search location...';
        input.style.padding = "5px";
        input.style.width = "150px";

        input.addEventListener('change', async function () {
            const query = input.value;
            const geoUrl = `https://nominatim.openstreetmap.org/search?q=${query}&format=json`;

            try {
                const response = await fetch(geoUrl);
                const results = await response.json();
                if (results.length > 0) {
                    const { lat, lon } = results[0];
                    map.setView([lat, lon], 13);
                    L.marker([lat, lon]).addTo(map).bindPopup(`Search Result: ${query}`).openPopup();
                } else {
                    alert("Location not found");
                }
            } catch (error) {
                console.error("Error fetching location:", error);
            }
        });

        return input;
    };
    searchBox.addTo(map);

    /** ECharts Setup **/
    const chart = echarts.init(document.getElementById('chart'));
    let isDarkTheme = false;
    let chartData = [5, 20, 36];
    const updateChart = (data) => {
        chart.setOption({
            title: { text: 'Interactive Chart' },
            tooltip: { trigger: 'item' },
            xAxis: { type: 'category', data: ['A', 'B', 'C'] },
            yAxis: { type: 'value' },
            series: [
                { type: 'bar', data },
                { type: 'line', data }
            ]
        });
    };

    // Initial Chart Render
    updateChart(chartData);

    // Update Chart with User Input
    document.getElementById('updateChart').addEventListener('click', () => {
        const valueA = parseInt(document.getElementById('valueA').value) || 0;
        const valueB = parseInt(document.getElementById('valueB').value) || 0;
        const valueC = parseInt(document.getElementById('valueC').value) || 0;
        chartData = [valueA, valueB, valueC];
        updateChart(chartData);
    });

    // Download Chart as Image
    document.getElementById('downloadChart').addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'chart.png';
        link.href = chart.getDataURL();
        link.click();
    });

    // Toggle Chart Theme
    document.getElementById('themeToggle').addEventListener('click', () => {
        isDarkTheme = !isDarkTheme;
        chart.setOption({ backgroundColor: isDarkTheme ? '#333' : '#fff' });
    });

    console.log("Enhanced map and chart features initialized.");
});
