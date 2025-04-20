let currentWeatherData = null; // Store API response globally

// Function to fetch weather data
function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  const apiKey = "a5f252bf2f094225947170708252004"; // Your API key (keep it secure)

  if (city === "") {
    alert("Please enter a city or country name.");
    return;
  }

  // Use HTTPS to avoid mixed content issues
  const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(city)}&aqi=yes`;

  // Fetch weather data from API
  fetch(apiUrl)
    .then((res) => res.json())
    .then((data) => {
      console.log(data); // For debugging

      if (data.error) {
        // If there is an error, show it
        document.getElementById("weatherInfo").innerHTML = `<p style="color:red;">⚠️ ${data.error.message}</p>`;
        return;
      }

      // Store the response data globally
      currentWeatherData = data;

      // Update temperature and weather info
      updateTemperature();
      document.getElementById("condition").innerText = `Condition: ${data.current.condition.text}`;
      document.getElementById("humidity").innerText = `Humidity: ${data.current.humidity}%`;

      const aqiIndex = data.current.air_quality["us-epa-index"];
      document.getElementById("air-quality").innerText = `Air Quality: ${getAQILevel(aqiIndex)}`;
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
      document.getElementById("weatherInfo").innerHTML = `<p style="color:red;">❌ Unable to fetch data.</p>`;
    });
}

// Function to update temperature based on selected unit (Celsius or Fahrenheit)
function updateTemperature() {
  if (!currentWeatherData) return;

  const isCelsius = document.getElementById("unitToggle").value === "C";
  const temp = isCelsius
    ? currentWeatherData.current.temp_c + "°C"
    : currentWeatherData.current.temp_f + "°F";

  // Display the temperature
  document.getElementById("temp").innerText = temp;
}

// Function to determine air quality level based on the index
function getAQILevel(index) {
  const levels = {
    1: "Good 😊",
    2: "Moderate 😐",
    3: "Unhealthy for Sensitive Groups 😷",
    4: "Unhealthy 😷",
    5: "Very Unhealthy 😫",
    6: "Hazardous ☠️",
  };
  return levels[index] || "Unknown";
}
