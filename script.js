async function fetchWeather() {
    let searchInput = document.getElementById("search").value;
    const weatherDataSection = document.getElementById("weather-data");
    const loader = document.getElementById("loader");
    weatherDataSection.style.display = "block";

    const apiKey = "411a5e080d60fdbf40d0d571fcacaae8"; 

    if (searchInput.trim() === "") {
        weatherDataSection.innerHTML = `
        <div>
          <h2>Empty Input!</h2>
          <p>Please try again with a valid <u>city name</u>.</p>
        </div>
        `;
        return;
    }

    loader.style.display = "block"; 
    weatherDataSection.innerHTML = "";

    async function getLonAndLat() {
        const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(searchInput)}&limit=1&appid=${apiKey}`;
        const response = await fetch(geocodeURL);

        if (!response.ok) {
            console.log("Bad response! ", response.status);
            return null;
        }

        const data = await response.json();

        if (data.length === 0) {
            weatherDataSection.innerHTML = `
            <div>
              <h2>Invalid Input: "${searchInput}"</h2>
              <p>Please try again with a valid <u>city name</u>.</p>
            </div>
            `;
            return null;
        }

        return data[0];
    }

    async function getWeatherData(lat, lon) {
        const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
        const response = await fetch(weatherURL);

        if (!response.ok) {
            console.log("Bad response! ", response.status);
            return;
        }

        const data = await response.json();

        weatherDataSection.innerHTML = `
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}" width="100" />
        <div>
          <h2>${data.name}</h2>
          <p><strong>Temperature:</strong> ${Math.round(data.main.temp - 273.15)}°C</p>
          <p><strong>Description:</strong> ${data.weather[0].description}</p>
        </div>
        `;
    }

    document.getElementById("search").value = "";

    const geoData = await getLonAndLat();
    if (geoData) {
        await getWeatherData(geoData.lat, geoData.lon);
    }

    loader.style.display = "none"; 
}
