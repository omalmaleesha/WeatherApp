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
            window.location.href = 'index.html'; // navigate to the main page
            
        });
    }

});