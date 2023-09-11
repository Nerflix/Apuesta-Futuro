const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Listen on port 3000
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});




// fetch league data
const { updateLeagueDataForCountries, scheduleMonthlyDataUpdate } = require('./apiRequests.js');
const countries = require('./countries.js'); // Import the list of countries

async function main() {
  try {
    await updateLeagueDataForCountries(countries);
    console.log('Data for all countries fetched and stored successfully.');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Call the main function to execute the desired tasks
main();

// Schedule the monthly data update
scheduleMonthlyDataUpdate(countries);
