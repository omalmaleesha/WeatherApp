// Get the city name from localStorage
const data = localStorage.getItem('data');
const apiKey = '85165bb0dba84049ada63652240109';
const apiKeyPhoto = 'KXf8BBZrbxsPUPAtu41mE1_PxSmcK8s1OaQrrfOSj9M'; 


const apifornowtoday = 'http://api.weatherapi.com/v1/forecast.json?key=85165bb0dba84049ada63652240109&q=London&days=1&aqi=yes&alerts=yes'; 


// Wait until the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function() {
    // Check if data exists in localStorage
    if (data != null) {
        let city = data; 
        const apiUrl = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=yes`;
        const apiUrlPhoto = `https://api.unsplash.com/search/photos?query=${city}&client_id=${apiKeyPhoto}`;
  
        fetch(apiUrlPhoto)
            .then(response =>{
                //check if the response is okay
                if(!response.ok){
                    throw new Error(`HTTP error! statuse: ${response.status}`)
                }
                return response.json();

            })
            .then(data =>{
                console.log('Location photos:', data);
                if (data.results.length > 0) {
                    const imageUrl = data.results[0].urls.regular;
                    console.log(imageUrl);
                    const imageAlt = data.results[0].alt_description;

                    // Set the background image of the div
                    document.getElementById('location-div').style.backgroundImage = `url(${imageUrl})`;
                    document.getElementById('location-div').style.backgroundSize = 'cover'; // Optional: Cover the entire div
                    document.getElementById('location-div').style.backgroundPosition = 'center'; 
                    
                } else {
                    console.log('No images found for this location.');
                }
            })
            .catch(error => {
                console.error('Error fetching the location photo:', error);
            });
        fetch(apiUrl)
            .then(response => {
                // Check if the response is okay
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Weather Data:', data);
                
                // Extract and display weather information
                
                

                const temperature = data.current.temp_c;
                document.getElementById('Temperature').innerText = temperature+"°C";
                const condition = data.current.condition.text;
                const  countryName = data.location.country;
                document.getElementById('countryName').innerText  = countryName;
                const humidity = data.current.humidity;
                const cityName = data.location.name;
                document.getElementById('cityname').innerText = cityName;
                const time = data.location.localtime;
                document.getElementById('time').innerText = time;
                const tempFerenhaid = data.current.temp_f;
                document.getElementById('tempFerenhaid').innerText = tempFerenhaid+"°F";
                const climate = data.current.condition.text;
                document.getElementById('weather').innerText = climate;
                const icon = data.current.condition.icon;
                document.getElementById('icon-img').src = icon;
                findWeatherImg(climate);
                fetchDataOfComingclimate(city);
                
                
                
                
                
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
            });
            //get the picture of the city 

    } else {
        console.log('No city found in localStorage.');
    }
});

function findWeatherImg(status){
    if(status != null){
        const apiUrlPhoto = `https://api.unsplash.com/search/photos?query=${status}&client_id=${apiKeyPhoto}`;
        fetch(apiUrlPhoto)
        .then(response =>{
            //check the response is okay
            if(!response.ok){
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data =>{
            console.log('Location photos:', data);
                if (data.results.length > 0) {
                    const imageUrl = data.results[0].urls.regular;
                    console.log(imageUrl);
                    const imageAlt = data.results[0].alt_description;

                    // Set the background image of the div
                    document.getElementById('location-divMain').style.backgroundImage = `url(${imageUrl})`;
                    document.getElementById('location-divMain').style.backgroundSize = `cover`; 
                    document.getElementById('location-divMain').style.backgroundPosition = `center`; 
                    document.getElementById('location-divMain').style.height = `570px`;
                    
                  
 
                    
                } else {
                    console.log('No images found for this location.');
                }
        })
        .catch(error => {
            console.error('Error fetching the location photo:', error);
        });
    }
}

function fetchDataOfComingclimate(city){
    if(city!=null){
        const apiDay = `http://api.weatherapi.com/v1/marine.json?key=${apiKey}&q=${city}&days=7`;
        fetch(apiDay)
        .then(response =>{
            if(!response.ok){
                throw new Error(`HTTP error! statuse: ${response.status}`);
            }
            return response.json();
        })
        .then(data =>{

            if (data.forecast && data.forecast.forecastday.length > 0) {
                const forecastDays = data.forecast.forecastday;
                
                // Ensure we loop for exactly 6 cards, even if there are fewer days in the forecast
                const numDays = Math.min(7, forecastDays.length);
            
                for (let i = 0; i < 7; i++) {
                    const index = i + 1; // IDs start from 1
                    if (i < numDays) {
                        // Fill card with forecast data
                        const dates = forecastDays[i].day;
            
                        const textClimate = dates.condition.text;
                        document.getElementById('textOftheCard' + index).innerText = textClimate;
            
                        const imgUrl = `https:${dates.condition.icon}`;
                        document.getElementById('iconOfTheCard' + index).src = imgUrl;
            
                        const temp = dates.avgtemp_c;
                        document.getElementById('textOftheCardTemp' + index).innerText = temp + "°C";
            
                        const wind = dates.maxwind_mph;
                        const uv = dates.uv;
                        const humidity = dates.avghumidity;
            
                        document.getElementById('details' + index).innerHTML = `Wind: ${wind} mph, UV: ${uv}, Humidity: ${humidity}%`;
                    } else {
                        // Placeholder for missing forecast data
                        document.getElementById('textOftheCard' + index).innerText = "No data available";
                        document.getElementById('iconOfTheCard' + index).src = "path/to/placeholder.png"; // Placeholder image
                        document.getElementById('textOftheCardTemp' + index).innerText = "--°C";
                        document.getElementById('details' + index).innerText = "Wind: -- mph, UV: --, Humidity: --%";
                    }
                }
            } else {
                console.log('No climate data available');
            }
            

        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
    }else {
        console.log('No city found in localStorage.');
    }
}




