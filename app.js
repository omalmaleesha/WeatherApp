let locationInputValue = "";
let index = 0;
console.log(locationInputValue);

document.addEventListener("DOMContentLoaded", function () {
  window.onload = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) => {
          fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
          )
            .then((response) => response.json())
            .then((data) => {
              const address = data.address || {};
              const city =
                address.city || address.town || address.village || "Unknown";
              const country = address.country || "Unknown";

              console.log("City name:", city); // Check the city name in the console

              // Update the UI with the fetched location
              document.getElementById(
                "cityName"
              ).innerText = `${city}, ${country}`;
              document.getElementById("city").innerText = city;

              // Call the getCurrentDetails function with the city name
              getCurrentDetail(city);
              fetchDataOfComingclimate(city);
            })
            .catch((error) => {
              console.error("Error fetching location:", error);
              document.getElementById("cityName").innerText =
                "Unable to fetch location";
            });
        },
        () => {
          document.getElementById("cityName").innerText = "Permission denied";
        }
      );
    } else {
      document.getElementById("cityName").innerText =
        "Geolocation not supported";
    }
  };
  window.addEventListener("load", function () {
    const storedDivs = JSON.parse(localStorage.getItem("customDivs")) || [];
    storedDivs.forEach((storedData) => {
      addNewDiv(storedData.city, storedData.index, storedData.weather); // Restore div and weather data
    });
  });

  //Add event listener to the "Add Location" button
  document.getElementById("addDivBtn").addEventListener("click", function () {
    // Get the input value
    const inputValue = document.getElementById("textNewInput").value;

    // Store the input value in the global variable
    locationInputValue = inputValue;
    console.log(locationInputValue);

    // For demonstration, you can log the value
    console.log("Location entered:", locationInputValue);
  });

  const container = document.getElementById("divRow");

  // Function to add a new div with video background
  function addNewDiv(text, index, weatherData = null) {
    const newDiv = document.createElement("div");
    newDiv.className = "col-lg-4 col-md-6 col-sm-12";
    newDiv.setAttribute("id", `div-${index}`);
    newDiv.innerHTML = `
            <div class="custom-div">
                <video autoplay muted loop playsinline disablepictureinpicture class="video-background">
                    <source src="img/video.mp4" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
                <div class="content text-black">
                    <div class="container">
                        <div class="row">
                            <div class="col-12 mb-1">
                                <h2 id="climate${index}" class="text-black fw-bolder">${text}</h2>
                                <p id="text${index}" class="text-black text-wrap">Details about the weather in ${text} right now</p>
                            </div>
                            <div class="col-12 mb-1">
                                <div class="text-white d-flex flex-column align-items-center justify-content-center">
                                    <h3 id="tempC${index}" class="text-black fw-bolder">°C</h3>
                                    <h4 id="time${index}" class="text-black"></h4>
                                    <img id="iconCity${index}" src="" alt="">
                                    <h6 id="humidity${index}" class="text-black"></h6>
                                    <h6 id="wind${index}" class="text-black"></h6>
                                    <h6 id="uv${index}" class="text-black"></h6>
                                </div>
                            </div>
                            <div class="col-12 mb-1">
                                <button class="btn btn-danger remove-btn" data-index="${index}">Remove</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    container.insertBefore(newDiv, container.firstChild); // Add to the front

    // Update the div with fetched weather data if available
    if (weatherData) {
      updateDivWithWeatherData(weatherData, index);
    }

    // Add event listener to remove the div when the remove button is clicked
    document
      .querySelector(`[data-index="${index}"]`)
      .addEventListener("click", function () {
        removeDiv(index);
      });
  }

  // Add div with video and save to sessionStorage when button is clicked
  // Add div with video and save to localStorage when button is clicked
  document.getElementById("addDivBtn").addEventListener("click", function () {
    const locationInput = locationInputValue; // Get the city name from input

    // Add the new div to the container
    addNewDiv(locationInput, index);
    fetchDataDiv(locationInput, index);
    index++;

    // Save the new div and weather data to localStorage
    const storedDivs = JSON.parse(localStorage.getItem("customDivs")) || [];
    storedDivs.unshift({ city: locationInput, index: index - 1 }); // Store the city and index
    localStorage.setItem("customDivs", JSON.stringify(storedDivs));
  });

  var btn = document.getElementById("btnHomePageOnAction");
  if (btn) {
    btn.addEventListener("click", function () {
      let searchInput = document.getElementById("inputSearchData").value;
      localStorage.setItem("data", searchInput);
      window.location.href = "homePage.html"; // navigate to the Home page
    });
  }
  var btnHome = document.getElementById("homepageOnAction");
  if (btnHome) {
    btnHome.addEventListener("click", function () {
      window.location.href = "index.html"; // navigate to the main page
    });
  }
  var btnlanding = document.getElementById("navigateLanding");
  if (btnlanding) {
    btnlanding.addEventListener("click", function () {
      window.location.href = "landing.html"; // navigate to the main page
    });
  }
});

function fetchDataDiv(name, index) {
  const city = name;
  const apiKey = "85165bb0dba84049ada63652240109";
  const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=yes`;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Weather Data:", data);

      // Extract weather data
      const weatherData = {
        city: name,
        temperature: data.current.temp_c,
        condition: data.current.condition.text,
        humidity: data.current.humidity,
        wind: data.current.wind_mph,
        uv: data.current.uv,
        time: data.location.localtime,
        icon: data.current.condition.icon,
        index: index,
      };

      // Update the div with fetched weather data
      updateDivWithWeatherData(weatherData, index);

      // Save the fetched data in localStorage
      const storedDivs = JSON.parse(localStorage.getItem("customDivs")) || [];
      const divIndex = storedDivs.findIndex((div) => div.index === index);
      if (divIndex !== -1) {
        storedDivs[divIndex].weather = weatherData; // Store weather data for the existing entry
        localStorage.setItem("customDivs", JSON.stringify(storedDivs));
      }
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
    });
}

// Function to update div with the fetched weather data
function updateDivWithWeatherData(data, index) {
  document.getElementById("tempC" + index).innerText = data.temperature + "°C";
  document.getElementById("text" + index).innerText = data.condition;
  document.getElementById("humidity" + index).innerText = data.humidity + "%";
  document.getElementById("wind" + index).innerText = data.wind + "mph";
  document.getElementById("uv" + index).innerText = data.uv + "mW/m2";
  document.getElementById("time" + index).innerText = data.time;
  document.getElementById("iconCity" + index).src = data.icon;
}
// Remove div from page and localStorage
function removeDiv(index) {
  // Remove div from the page
  const divToRemove = document.getElementById(`div-${index}`);
  if (divToRemove) {
    divToRemove.remove();
  }

  // Remove div from localStorage
  let storedDivs = JSON.parse(localStorage.getItem("customDivs")) || [];
  storedDivs = storedDivs.filter((div) => div.index !== index); // Remove the div with the matching index
  localStorage.setItem("customDivs", JSON.stringify(storedDivs));
}

function getCurrentDetail(name) {
  const city = name;
  const apiKey = "85165bb0dba84049ada63652240109";
  const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=yes`;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Weather Data:", data);

      // Extract and display weather information
      const temperature = data.current.temp_c;
      document.getElementById("TemperatureMain").innerText = temperature + "°C";
      const condition = data.current.condition.text;
      const humidity = data.current.humidity;
      document.getElementById("humidity").innerText = humidity + "%";
      const wind = data.current.wind_mph;
      document.getElementById("wind").innerText = wind + "mph";
      const uv = data.current.uv;
      document.getElementById("uv").innerText = uv + "mW/m2";
      const time = data.location.localtime;
      document.getElementById("time").innerText = time;
      const icon = data.current.condition.icon;
      document.getElementById("icon-imgs").src = icon;

      // Fetch future climate data (assuming you have another function for that)
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
    });
}

function fetchDataOfComingclimate(name) {
  const city = name;
  const apiKey = "85165bb0dba84049ada63652240109"; // Replace with your actual API key
  const apiUrl = `http://api.weatherapi.com/v1/marine.json?key=${apiKey}&q=${city}&days=5`;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (data.forecast && data.forecast.forecastday.length > 0) {
        const forecastDays = data.forecast.forecastday;

        // Ensure we loop for exactly 6 cards, even if there are fewer days in the forecast
        const numDays = Math.min(5, forecastDays.length);

        for (let i = 0; i < 5; i++) {
          const index = i + 1; // IDs start from 1
          if (i < numDays) {
            // Fill card with forecast data
            const dates = forecastDays[i].day;
            const dateOfCurrent = forecastDays[i].date;
            document.getElementById("date" + index).innerText = dateOfCurrent;

            const imgUrl = `https:${dates.condition.icon}`;
            document.getElementById("img-card" + index).src = imgUrl;

            const temp = dates.avgtemp_c;
            document.getElementById("weather" + index).innerText = temp + "°C";

            const tempf = dates.avgtemp_f;
            document.getElementById("tempF" + index).innerText = tempf + "°F";

            const wind = dates.maxwind_mph;
            const humidity = dates.avghumidity;

            document.getElementById(
              "more" + index
            ).innerText = `Wind: ${wind} mph, Humidity: ${humidity}%`;
          } else {
            // Placeholder for missing forecast data
            document.getElementById("img-card" + index).src = "img/paris.jpg"; // Placeholder image
            document.getElementById("weather" + index).innerText = "--°C";
            document.getElementById("tempF" + index).innerText = "--°F";
            document.getElementById("more" + index).innerText =
              "Wind: -- mph, Humidity: --%";
          }
        }
      } else {
        console.log("No climate data available");
      }

      // Fetch future climate data (assuming you have another function for that)
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
    });
}
