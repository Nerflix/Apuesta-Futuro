const admin = require('firebase-admin');
const axios = require('axios');
const schedule = require('node-schedule');

// Initialize Firebase Admin SDK with your credentials
const serviceAccount = require('./auth-33fba-firebase-adminsdk-4zu9e-8f584ed8e7.json'); // Service account key
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://auth-33fba-default-rtdb.firebaseio.com/', // Firebase Database URL
});

// Function to fetch league data for a specific country
async function fetchLeagueData(country) {
  try {
    const options = {
      method: 'GET',
      url: 'https://api-football-v1.p.rapidapi.com/v3/leagues',
      params: { country: country },
      headers: {
        'X-RapidAPI-Key': 'a030dda9b5msh5e55e21a12d0abcp1bc6fejsn640ee70d267f',
        'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
      },
    };

    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Function to store league data in Firebase for a specific country
async function storeLeagueDataInFirebase(country) {
  try {
    const db = admin.database();
    const countryRef = db.ref(`API-Endpoints/leagues/${country}`);
    const leagueData = await fetchLeagueData(country);
    await countryRef.set(leagueData);
    console.log(`Data for ${country} leagues stored successfully.`);
  } catch (error) {
    console.error(error);
  }
}

// Function to update league data for multiple countries
async function updateLeagueDataForCountries(countries) {
  try {
    for (const country of countries) {
      await storeLeagueDataInFirebase(country);
    }
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  updateLeagueDataForCountries,
};

// Function to schedule the data update to occur once each month
function scheduleMonthlyDataUpdate(countries) {
  // Schedule the function to run once a month (on the 1st day of each month at midnight)
  const updateJob = schedule.scheduleJob('0 0 1 * *', async () => {
    console.log('Scheduled data update...');
    try {
      await updateLeagueDataForCountries(countries);
      console.log('Data updated.');
    } catch (error) {
      console.error('Error updating data:', error);
    }
  });
}

module.exports = {
  updateLeagueDataForCountries,
  scheduleMonthlyDataUpdate,
};