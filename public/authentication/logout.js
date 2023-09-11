import {
    getAuth,
    signOut,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
  } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js";
  import app from "../firebase-config.js"; // Import the Firebase app instance
  
  const auth = getAuth(app);

  // Get a reference to the "Logout" link by its ID
const logoutLink = document.getElementById("logout-link");

// Add a click event listener to the "Logout" link
logoutLink.addEventListener("click", (event) => {
  event.preventDefault(); // Prevent the link from navigating to a new page

  // Sign out the user
  signOut(auth)
    .then(() => {
      // To delete the "user" variable from localStorage
      localStorage.removeItem("user");
      localStorage.setItem('isLoggedIn', 'false');
      window.location.href = 'index.html';

      // Sign-out successful.
      console.log("User signed out successfully");
      // Optionally, redirect to a different page or update the UI.
    })
    .catch((error) => {
      // An error occurred.
      console.error("Error signing out:", error);
    });
});
