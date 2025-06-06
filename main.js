//   ✓  1 test\main.spec.js:28:3 › Server Setup › should load successfully (25ms)
//   ✓  2 …:3 › HTML › should have an H1 with the text "San Diego Top Spots" (280ms)
//   ✓  3 test\main.spec.js:44:3 › HTML › should load the correct page title (59ms)
//   ✓  4 test\main.spec.js:54:3 › Integration › should find a row with data (5.0s)
//   ✓  5 …s:59:3 › Integration › should find a link with the correct map url (5.0s)

//JSON file is array of 30 objects with keys 'name', 'description', and 'location'
let TOPSPOTS;

//Can also be written as $(function(){...});
$(document).ready(function () {
  $.getJSON("data.json", function (data) {
    console.log("Document ready function executed");
    TOPSPOTS = data;
    console.log(TOPSPOTS);
    populateTable(TOPSPOTS);
  });
});

// // Clear existing rows if any, except the header
// if (mainTableBody) {
//   mainTableBody.innerHTML = '';
// } else {
//   console.error("Could not find tbody in mainTable");
//   return;
// }

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
