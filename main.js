document.addEventListener("DOMContentLoaded", function () {
    /** Leaflet Map Setup **/
    const map = L.map("map").setView([51.505, -0.09], 13);
    const baseLayers = {
        Streets: L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: "© OpenStreetMap contributors" }),
        Satellite: L.tileLayer("https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png", { maxZoom: 19, attribution: "© OpenStreetMap contributors" })
    };
    baseLayers.Streets.addTo(map);

    L.control.layers(baseLayers).addTo(map);

    /** Search and Weather Features **/
    map.on("click", async function (e) {
        const { lat, lng } = e.latlng;
        const apiKey = "your_openweathermap_api_key";
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

    document.getElementById("resetMap").addEventListener("click", () => map.setView([51.505, -0.09], 13));

    /** ECharts Setup **/
    const chart = echarts.init(document.getElementById("chart"));
    let chartData = [5, 20, 36];
    const updateChart = (data) => {
        chart.setOption({
            title: { text: "Interactive Chart" },
            tooltip: { trigger: "item" },
            xAxis: { type: "category", data: ["A", "B", "C"] },
            yAxis: { type: "value" },
            series: [
                { type: "bar", data },
                { type: "line", data }
            ]
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
                    const data = JSON.parse(e.target.result);
                    if (Array.isArray(data)) {
                        chartData = data;
                        updateChart(chartData);
                    } else {
                        alert("Invalid data format. Please upload a valid JSON array.");
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

    document.getElementById("themeToggle").addEventListener("click", () => {
        const isDark = chart.getOption().backgroundColor === "#333";
        chart.setOption({ backgroundColor: isDark ? "#fff" : "#333" });
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
import { CONFIG } from './config.js';

const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${CONFIG.OPEN_WEATHER_MAP_API_KEY}&units=metric`;

const response = await fetch(weatherUrl);
if (response.ok) {
    const weather = await response.json();
    // Process weather data...
}
