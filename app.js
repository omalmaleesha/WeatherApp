document.addEventListener("DOMContentLoaded", function() {
    var btn = document.getElementById('btnHomePageOnAction');
    if (btn) {
        btn.addEventListener('click', function() {
            let searchInput = document.getElementById('inputSearchData').value;
            localStorage.setItem('data', searchInput);
            window.location.href = 'homePage.html';// navigate to the Home page
        });
    }
    var btnHome = document.getElementById('homepageOnAction');
    if (btnHome) {
        btnHome.addEventListener('click' , function(){
            window.location.href = 'landing.html'; // navigate to the main page
            
        });
    }
    var btnlanding = document.getElementById('navigateLanding');
    if (btnlanding) {
        btnlanding.addEventListener('click' , function(){
            window.location.href = 'landing.html'; // navigate to the main page
            
        });
    }

});


// function updateCityTime() {
//     const now = new Date();
//     const options = {
//       timeZone: 'America/New_York', // Change this to the desired city/country time zone
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit',
//       hour12: false // 24-hour format; set to true for 12-hour AM/PM format
//     };
    
//     const formatter = new Intl.DateTimeFormat('en-US', options);
//     const timeString = formatter.format(now);
    
//     document.getElementById('cityClock').textContent = timeString;
//   }

//   // Update the city time every second
//   setInterval(updateCityTime, 1000);
