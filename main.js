import { CONFIG } from './config.js'; // Import must be at the top of the module

document.addEventListener("DOMContentLoaded", function () {
    /** Leaflet Map Setup **/
    const map = L.map("map").setView([51.505, -0.09], 13);
    const baseLayers = {
        Streets: L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: "© OpenStreetMap contributors" }),
        Satellite: L.tileLayer("https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png", { maxZoom: 19, attribution: "© OpenStreetMap contributors" })
    };
    baseLayers.Streets.addTo(map);

    L.control.layers(baseLayers).addTo(map);

    /** Weather Features **/
    map.on("click", async function (e) {
        const { lat, lng } = e.latlng; // Get latitude and longitude of the clicked location
        const apiKey = CONFIG.OPEN_WEATHER_MAP_API_KEY;
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`;

        let weatherInfo = "Weather data unavailable";
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

        const marker = L.marker([lat, lng]).addTo(map);
        marker.bindPopup(`Location: ${lat.toFixed(2)}, ${lng.toFixed(2)}<br>${weatherInfo}`).openPopup();

        // Refresh weather data every 60 seconds
        setInterval(async () => {
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
                    marker.setPopupContent(`Location: ${lat.toFixed(2)}, ${lng.toFixed(2)}<br>${weatherInfo}`);
                }
            } catch (error) {
                console.error("Error refreshing weather data:", error);
            }
        }, 60000);
    });

    /** Search Feature **/
    searchButton.addEventListener("click", async () => {
        const query = searchBar.value.trim();
        if (!query) {
            alert("Please enter a location to search.");
            return;
        }

        const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
        try {
            const response = await fetch(geocodeUrl);
            if (!response.ok) throw new Error("Failed to fetch location data.");

            const results = await response.json();
            if (results.length === 0) {
                alert("No locations found. Try a different search term.");
                return;
            }

            const { lat, lon, display_name } = results[0];
            map.setView([lat, lon], 15);

            const marker = L.marker([lat, lon]).addTo(map);
            marker.bindPopup(`<b>${display_name}</b>`).openPopup();

            // Fetch weather data for searched location
            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${CONFIG.OPEN_WEATHER_MAP_API_KEY}&units=metric`;
            try {
                const weatherResponse = await fetch(weatherUrl);
                if (weatherResponse.ok) {
                    const weather = await weatherResponse.json();
                    const weatherInfo = `
                        <b>Weather:</b> ${weather.weather[0].description}<br>
                        <b>Temperature:</b> ${weather.main.temp} °C<br>
                        <b>Humidity:</b> ${weather.main.humidity}%<br>
                        <b>Wind Speed:</b> ${weather.wind.speed} m/s
                    `;
                    marker.bindPopup(`<b>${display_name}</b><br>${weatherInfo}`).openPopup();
                }
            } catch (error) {
                console.error("Error fetching weather data:", error);
            }
        } catch (error) {
            console.error("Error searching location:", error);
            alert("An error occurred while searching. Please try again.");
        }
    });

   /**  ECharts Setup **/
const chart = echarts.init(document.getElementById("chart"));
let chartData = [5, 20, 36];
let chartLabels = ["A", "B", "C"];

const updateChart = (data, labels = chartLabels) => {
    chart.setOption({
        title: { text: "Interactive Chart" },
        tooltip: {
            trigger: "axis",
            formatter: (params) => {
                return params.map(p => `${p.seriesName}: ${p.value}`).join("<br>");
            }
        },
        xAxis: { type: "category", data: labels },
        yAxis: { type: "value" },
        series: [
            { type: "bar", data, name: "Bar Series" },
            { type: "line", data, name: "Line Series" }
        ],
        dataZoom: [{ type: "slider", start: 0, end: 100 }],
        toolbox: {
            feature: {
                saveAsImage: { show: true },
                magicType: { type: ["line", "bar", "pie"] },
                restore: { show: true }
            }
        }
    });
};

updateChart(chartData);

document.getElementById("updateChart").addEventListener("click", () => {
    const valueA = parseInt(prompt("Enter value for A:", 5)) || 0;
    const valueB = parseInt(prompt("Enter value for B:", 20)) || 0;
    const valueC = parseInt(prompt("Enter value for C:", 36)) || 0;
    chartData = [valueA, valueB, valueC];
    updateChart(chartData);
});

document.getElementById("uploadData").addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const json = JSON.parse(e.target.result);
                if (Array.isArray(json.data) && Array.isArray(json.labels)) {
                    chartData = json.data;
                    chartLabels = json.labels;
                    updateChart(chartData, chartLabels);
                    alert("Data uploaded successfully!");
                } else {
                    alert("Invalid format. JSON must include 'data' and 'labels' arrays.");
                }
            } catch (error) {
                alert("Error reading file: " + error.message);
            }
        };
        reader.readAsText(file);
    }
});

document.getElementById("downloadChart").addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = "chart.png";
    link.href = chart.getDataURL();
    link.click();
});

document.getElementById("themeToggle").addEventListener("change", (event) => {
    const themes = {
        light: { backgroundColor: "#fff" },
        dark: { backgroundColor: "#333" },
        ocean: { backgroundColor: "#2b2f77" }
    };
    const selectedTheme = themes[event.target.value];
    chart.setOption({ backgroundColor: selectedTheme.backgroundColor });
});

document.getElementById("downloadData").addEventListener("click", () => {
    const dataStr = JSON.stringify({ data: chartData, labels: chartLabels }, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "chartData.json";
    link.click();
});

setInterval(() => {
    const simulatedData = chartData.map(() => Math.floor(Math.random() * 50) + 1);
    updateChart(simulatedData, chartLabels);
}, 5000); // Updates every 5 seconds

window.addEventListener("resize", () => {
    chart.resize();
});

    /** Language Change **/
    document.getElementById("languageSelect").addEventListener("change", (event) => {
        const lang = event.target.value;
        const translations = {
            en: { title: "Interactive Chart", a: "A", b: "B", c: "C" },
            es: { title: "Gráfico Interactivo", a: "A", b: "B", c: "C" },
            fr: { title: "Graphique Interactif", a: "A", b: "B", c: "C" }
        };

        const { title, a, b, c } = translations[lang];
        chart.setOption({
            title: { text: title },
            xAxis: { data: [a, b, c] }
        });
    });
});

document.getElementById("resetMap").addEventListener("click", () => {
    // Reset map to the initial view
    map.setView([51.505, -0.09], 13);

    // Remove all markers from the map
    map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });
});
