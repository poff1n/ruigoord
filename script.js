const app = document.getElementById('app');
const svgImages = document.querySelectorAll('.svg-image');

const squares = Array.from(svgImages).map(svg => {
  return {
    lat: parseFloat(svg.getAttribute('data-lat')),
    lng: parseFloat(svg.getAttribute('data-lng')),
    id: svg.getAttribute('id')
  };
});

window.onload = function() {
  // Update the sizes of the objects after the page has loaded
  updateSizes();

  // Add transition to the objects after a short delay to ensure initial size change is included
  setTimeout(() => {
    const svgImages = document.querySelectorAll('.svg-image');
    svgImages.forEach(svg => {
      svg.style.transition = 'height 0.5s ease-in-out'; // Apply transition only to height
    });
  }, 100); // Adjust the delay time as needed
};

function showPopup() {
  document.getElementById('popupContainer').style.display = 'block';
}

function hidePopup() {
  document.getElementById('popupContainer').style.display = 'none';
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function updateSizes() {
  navigator.geolocation.getCurrentPosition(position => {
    hidePopup();
    const userLat = position.coords.latitude;
    const userLng = position.coords.longitude;

    squares.forEach(square => {
      const squareElement = document.getElementById(square.id);
      if (squareElement) {
        const distance = calculateDistance(userLat, userLng, square.lat, square.lng);
        
        // Adjust the formula for scaling the height smoothly between 10 and 200 meters
        let height;
        if (distance <= 10) {
          height = 400; // Max height at 10 meters
        } else if (distance >= 200) {
          height = 30; // Min height at 200 meters
        } else {
          // Scale the height smoothly between 10 and 200 meters
          height = 400 - (distance - 10) * (370 / 190); // Adjust this value as needed
        }

        squareElement.style.height = `${height}px`;
        squareElement.style.width = 'auto'; // Set width to automatic
      }
    });
  }, error => {
    console.error('Error finding your location:', error.message);
    showPopup();
    // Reset square sizes to their minimum
    squares.forEach(square => {
      const squareElement = document.getElementById(square.id);
      if (squareElement) {
        squareElement.style.width = 'auto';
        squareElement.style.height = '30px';
      }
    });
  });
}

window.onload = updateSizes;
setInterval(updateSizes, 500); // Update location of the visitor every second.
