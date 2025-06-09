//   ✓  1 test\main.spec.js:28:3 › Server Setup › should load successfully (25ms)
//   ✓  2 …:3 › HTML › should have an H1 with the text "San Diego Top Spots" (280ms)
//   ✓  3 test\main.spec.js:44:3 › HTML › should load the correct page title (59ms)
//   ✓  4 test\main.spec.js:54:3 › Integration › should find a row with data (5.0s)
//   ✓  5 …s:59:3 › Integration › should find a link with the correct map url (5.0s)

let TOPSPOTS;

//Can also be written as $(function(){...});
$(document).ready(function () {
  $.getJSON("data.json", function (data) {
    console.log("Document ready function executed");
    TOPSPOTS = data;
    addMapMarkers(TOPSPOTS);
    populateTable(TOPSPOTS);
  });
});

//Called on document ready
function populateTable(data) {
  const mainTableBody = document.getElementById("mainTablebody");

  for (let element of data) {
    let row = document.createElement("tr"); // Create a new row for each element

    let nameCell = document.createElement("td"); // Create a new cell for the name
    nameCell.textContent = element.name;
    row.appendChild(nameCell);

    let descriptionCell = document.createElement("td"); // Create a new cell for the description
    descriptionCell.textContent = element.description;
    row.appendChild(descriptionCell);

    let locationCell = document.createElement("td"); // Create a new cell for the location link
    let link = document.createElement("a");
    if (element.location && element.location.length === 2) {
      link.href = `https://www.google.com/maps?q=${element.location[0]},${element.location[1]}`;
      link.textContent = "Open in Google Maps";
      link.target = "_blank"; // Open in a new tab
    } else {
      link.textContent = "Location N/A";
    }
    locationCell.appendChild(link);
    row.appendChild(locationCell);

    mainTableBody.appendChild(row); // Append the newly created and populated row to the table body
  }
}

//Called on document ready
function addMapMarkers(data) {
  const map = document.getElementsByTagName("gmp-map")[0];

  for (let element of data) {
    let pin = document.createElement("gmp-advanced-marker");
    pin.position = { lat: element.location[0], lng: element.location[1] };
    pin.title = element.title;

    if (element.location && element.location.length === 2) {
      const mapsUrl = `https://www.google.com/maps?q=${element.location[0]},${element.location[1]}`;
      pin.addEventListener("click", () => {
        window.open(mapsUrl, "_blank");
      });
    }

    map.appendChild(pin);
  }
}

//Haversine Distance formula to calculate miles between two lat longs
function haversineDistance(lat1, lon1, lat2, lon2) {
  const toRad = (angle) => (angle * Math.PI) / 180;
  const R = 3958.8; // miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(2);
}

//Handler for user clicking Sort by distance!
document
  .getElementById("userLocation")
  .addEventListener("click", function useUserInput() {
    userLocation = document.getElementById("userInput").value;
    if (userLocation === "") {
      alert("Please enter a location.");
      return;
    }

    console.log("User input:", userLocation); //ASK FOR lat long
    [userLat, userLong] = userLocation.split(",").map(Number);

    addDistanceColumn();
    addDistancestoRows(userLat, userLong);
    // sortByDistance();
  });

//Called on sort by distance click
function addDistanceColumn() {
  let header = document.getElementById("TableHeaders");
  if (!document.getElementById("distanceHeader")) {
    let distanceColumn = document.createElement("th");
    distanceColumn.id = "distanceHeader";
    distanceColumn.textContent = "Distance from user";
    header.appendChild(distanceColumn);
  }

  const mainTableBody = document.getElementById("mainTablebody");
  const rows = mainTableBody.getElementsByTagName("tr");
  for (let i = 0; i < rows.length; i++) {
    // Avoid adding multiple distance cells if button is clicked multiple times
    if (rows[i].children.length < 4) {
      let distanceCell = document.createElement("td");
      rows[i].appendChild(distanceCell);
    }
  }
}

function addDistancestoRows(userLat, userLong) {
  TOPSPOTS.forEach((currentSpot, index) => {
    [spotLat, spotLong] = currentSpot.location;
    const distance = haversineDistance(userLat, userLong, spotLat, spotLong);
    currentSpot.distance = parseFloat(distance);
    addDistanceToRow(distance + " miles", index);
  });
}

function addDistanceToRow(distance, rowIndex) {
  const mainTableBody = document.getElementById("mainTablebody");
  const topSpotRows = mainTableBody.getElementsByTagName("tr");

  const targetRow = topSpotRows[rowIndex];
  const targetRowCells = targetRow.getElementsByTagName("td");
  const DISTANCE_CELL = 3;
  targetRowCells[DISTANCE_CELL].textContent = distance;
}

// function sortByDistance(){

// }
