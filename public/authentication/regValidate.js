import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js";
import app from "/firebase-config.js"; // Import the Firebase app instance
import {
  getDatabase,
  ref,
  set,
  get,
} from "https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js";

const auth = getAuth(app);
const database = getDatabase(app);

// Get the authentication instance
const registration = document.getElementById("registration");
const form = document.getElementById("form");
const username = document.getElementById("username");
const email = document.getElementById("email");
const firstname = document.getElementById("firstname");
const lastname = document.getElementById("lastname");
const city = document.getElementById("city");
const zipcode = document.getElementById("zipcode");
const postalcode = document.getElementById("postalcode");
const phonenumber = document.getElementById("phonenumber");
const password = document.getElementById("password");
const password2 = document.getElementById("password2");
const countrySelect = document.getElementById("countrySelect");
let errorCode;
let errorMessage;
let selectedCountryISO2;
let dialCode;
let timeZone;
let timeZoneOffsetHours;
let timeZoneOffsetMinutes;
let utc_time;
let newPhoneNumber;
let countryData;
// Initialize libphonenumber-js instance
const phoneUtil = window.intlTelInputGlobals.intlTelInputUtils;

// Populate country dropdown using libphonenumber-js metadata
const metadata = window.intlTelInputGlobals.getCountryData();
metadata.forEach((country) => {
  const option = document.createElement("option");
  option.value = country.iso2;
  option.text = country.name;
  countrySelect.appendChild(option);
});

// Add event listener to the country dropdown
countrySelect.addEventListener("change", () => {
  selectedCountryISO2 = countrySelect.value;
  countryData = metadata.find(
    (country) => country.iso2 === selectedCountryISO2
  );
  dialCode = countryData.dialCode;
  const dateObject = new Date(); // Replace with your date object
  // Get the time zone offset in minutes
  const timeZoneOffsetMinutes = dateObject.getTimezoneOffset();

  if (timeZoneOffsetMinutes == 0) {
    timeZoneOffsetHours = 0;
  } else {
    
    timeZoneOffsetHours = -(timeZoneOffsetMinutes / 60);
    if (timeZoneOffsetHours < 0) {
      utc_time = timeZoneOffsetHours - 1;
    } else {
      utc_time = timeZoneOffsetHours;
    }
  }
  console.log(timeZoneOffsetHours);
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("hello");

  validateInputs();
});

const setError = (element, message) => {
  const inputControl = element.parentElement;
  const errorDisplay = inputControl.querySelector(".error");

  errorDisplay.innerText = message;
  inputControl.classList.add("error");
  inputControl.classList.remove("success");
};

const setSuccess = (element) => {
  const inputControl = element.parentElement;
  const errorDisplay = inputControl.querySelector(".error");

  errorDisplay.innerText = "";
  inputControl.classList.add("success");
  inputControl.classList.remove("error");
};

const isValidEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

function isValidPassword(password) {
  // Regular expressions to check for uppercase letter, number, and special character
  const hasUppercase = /[A-Z]/;
  const hasNumber = /\d/;
  const hasSpecialCharacter = /[!@#$%^&*()\-_=+{}[\]|;:'",.<>/?]/;

  // Check if the password meets the requirements
  if (
    hasUppercase.test(password) &&
    hasNumber.test(password) &&
    hasSpecialCharacter.test(password)
  ) {
    return true;
  } else {
    return false;
  }
}

const validateInputs = () => {
  const usernameValue = username.value.trim();
  const emailValue = email.value.trim();
  const passwordValue = password.value.trim();
  const password2Value = password2.value.trim();
  const firstnameValue = firstname.value.trim();
  const lastnameValue = lastname.value.trim();
  const phonenumberValue = phonenumber.value.trim();
  const cityValue = city.value.trim();
  const zipcodeValue = zipcode.value.trim();
  const postalcodeValue = postalcode.value.trim();
  let countryValue;
  let hasErrors = false;

  //validate country
  if (countryData === undefined) {
    console.log("No country selected. Country can't be empty.");
    setError(countrySelect, "Country is required");
    hasErrors = true;
  } else {
    countryValue = countryData.name;
    // Your validation logic using countryValue
    setSuccess(countrySelect);
  }

  //validate username
  if (usernameValue === "") {
    setError(username, "Username is required");
    hasErrors = true;
  } else {
    setSuccess(username);
  }
  //validate email
  if (emailValue === "") {
    setError(email, "Email is required");
    hasErrors = true;
  } else if (!isValidEmail(emailValue)) {
    setError(email, "Provide a valid email address");
    hasErrors = true;
  } else {
    setSuccess(email);
  }
  //validate password
  if (passwordValue === "") {
    setError(password, "Password is required");
    hasErrors = true;
  } else if (passwordValue.length < 8) {
    setError(password, "Password must be at least 8 character.");
    hasErrors = true;
  } else if (!isValidPassword(passwordValue)) {
    setError(
      password,
      "Must have an uppercase, a number and a special character"
    );
    hasErrors = true;
  } else {
    setSuccess(password);
  }
  //validate password 2
  if (password2Value === "") {
    setError(password2, "Please confirm your password");
    hasErrors = true;
  } else if (password2Value !== passwordValue) {
    setError(password2, "Passwords doesn't match");
    hasErrors = true;
  } else {
    setSuccess(password2);
  }

  //validate first name
  if (firstnameValue === "") {
    setError(firstname, "First Name is required");
    hasErrors = true;
  } else {
    setSuccess(firstname);
  }
  //validate lastname
  if (lastnameValue === "") {
    setError(lastname, "Last Name is required");
    hasErrors = true;
  } else {
    setSuccess(lastname);
  }
  //validate phone number
  if (phonenumberValue === "") {
    setError(phonenumber, "Phone No is required");
    hasErrors = true;
  } else if (phonenumberValue.length !== 10) {
    setError(phonenumber, "Number must be 10 digits");
    hasErrors = true;
  } else {
    setSuccess(phonenumber);
    newPhoneNumber = dialCode + phonenumberValue.slice(1);
    console.log(newPhoneNumber);
  }
  //validate city
  if (cityValue === "") {
    setError(city, "City is required");
    hasErrors = true;
  } else {
    setSuccess(city);
  }
  //validate  zip code
  if (zipcodeValue === "") {
    setError(zipcode, "Zip code is required");
    hasErrors = true;
  } else {
    setSuccess(zipcode);
  }
  // validate postal code
  if (postalcodeValue === "") {
    setError(postalcode, "Postal Code is required");
    hasErrors = true;
  } else {
    setSuccess(postalcode);
  }

  // Check if any input field has errors
  if (hasErrors) {
    console.log("There are validation errors.");
    // Handle the case where there are validation errors
  } else {
    // All input fields are valid, proceed to create the user
    createUserWithEmailAndPassword(auth, emailValue, passwordValue)
      .then((userCredential) => {
        const user = auth.currentUser;
        localStorage.setItem("user", JSON.stringify(user));
        // Signed in
        if (user) {
          // Define the path to the user's profile data
          const userUid = user.uid; // Replace with the actual user UID
          const profileDataRef = ref(database, `users/${userUid}/profiledata`);
          const profileData = {
            email: emailValue,
            firstname: firstnameValue,
            lastname: lastnameValue,
            username: usernameValue,
            phonenumber: newPhoneNumber,
            country: countryValue,
            city: cityValue,
            dialCode: dialCode,
            postalcode: postalcodeValue,
            utc_time: utc_time,
            zipcode: zipcodeValue,
            userid: user.uid,
            // Other user profile data...
          };

          set(profileDataRef, profileData)
            .then(() => {
              console.log("Profile data stored successfully.");
              window.location.href = "../index.html";
            })
            .catch((error) => {
              console.error("Error storing profile data:", error);
            });
        } else {
          console.error("No authenticated user.");
        }
        // ...
      })
      .catch((error) => {
        errorCode = error.code;
        errorMessage = error.message;
        setError(registration, errorMessage);
        console.log(errorMessage);
        // ..
      });
  }
};
