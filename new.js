const admin = require('firebase-admin');

// Initialize Firebase Admin SDK with your credentials
const serviceAccount = require('./auth-33fba-firebase-adminsdk-4zu9e-8f584ed8e7.json'); // Service account key
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://auth-33fba-default-rtdb.firebaseio.com/', // Firebase Database URL
});

// Reference to the parent node you want to delete
const parentRef = admin.database().ref('API-Endpoints/leagues');

// Remove the parent node and all its child nodes
parentRef.remove()
  .then(() => {
    console.log('API-Endpoints node and all child nodes have been deleted successfully.');
    process.exit(0); // Exit the script
  })
  .catch((error) => {
    console.error('Error deleting the API-Endpoints node:', error);
    process.exit(1); // Exit the script with an error status
  });
