const apiUrl = 'https://api.bestshop.ge/api/locations/search';
const apiKey = '19|epZGkYVaF71fVDxZP0SCHJqy5QKT9wDfcQlfsFjg5250a358';
const searchBox = document.getElementById('search-box');
const suggestionsList = document.getElementById('suggestions-list');
const mapIframe = document.getElementById('map-iframe');

searchBox.addEventListener('input', debounce(handleInput, 300));

function handleInput() {
    const query = searchBox.value.trim();

    if (query.length === 0) {
        suggestionsList.style.display = 'none';
        mapIframe.src = ''; // Clear the iframe source when there's no input
        return;
    }

    fetch(`${apiUrl}?q=${query}&api_key=${apiKey}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            if (response.status === 500) {
                throw new Error('Internal server error. Please try again later.');
            } else {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        }
        return response.json();
    })
    .then(data => {
        if (data && data.length > 0) {
            displaySuggestions(data);
        } else {
            suggestionsList.style.display = 'none';
        }
    })
    .catch(error => {
        console.error('Error fetching data:', error.message);
        // Display error message to the user or handle it in an appropriate way
    });
}

function displaySuggestions(suggestions) {
    suggestionsList.innerHTML = '';

    suggestions.forEach(suggestion => {
        const listItem = document.createElement('li');

        if (suggestion.name) {
            listItem.textContent = suggestion.name;
        } else {
            console.error('Missing property in API response:', suggestion);
            return; // Skip this suggestion if the property is missing
        }

        listItem.addEventListener('click', () => {
            searchBox.value = suggestion.name;
            suggestionsList.style.display = 'none';

            // Load the map for the selected location
            loadMap(suggestion.lat, suggestion.lng);
        });

        suggestionsList.appendChild(listItem);
    });

    suggestionsList.style.display = 'block';
}

function loadMap(lat, lng) {
    // Replace this with the actual map embed URL or code from your map provider
    const mapUrl = `https://www.google.com/maps/embed/v1/view?key=${apiKey}&center=${lat},${lng}&zoom=15`;
    
    mapIframe.src = mapUrl;
}

function debounce(func, wait) {
    let timeout;
    return function () {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function () {
            func.apply(context, args);
        }, wait);
    };
}
