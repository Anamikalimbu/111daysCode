const form = document.getElementById("form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

// Show error
function setError(input, message) {
  const group = input.parentElement;
  const small = group.querySelector("small");
  group.className = "input-group error";
  small.innerText = message;
}

// Show success
function setSuccess(input) {
  const group = input.parentElement;
  group.className = "input-group success";
}

function validateEmail(email) {
  const pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
  return pattern.test(email);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  let valid = true;

  // Name
  if (nameInput.value.trim() === "") {
    setError(nameInput, "Name is required");
    valid = false;
  } else {
    setSuccess(nameInput);
  }

  // Email
  if (emailInput.value.trim() === "") {
    setError(emailInput, "Email is required");
    valid = false;
  } 
  else if (!validateEmail(emailInput.value)) {
    setError(emailInput, "Enter a valid email");
    valid = false;
  } 
  else {
    setSuccess(emailInput);
  }

  // Password
  if (passwordInput.value.length < 6) {
    setError(passwordInput, "Password must be at least 6 characters");
    valid = false;
  } else {
    setSuccess(passwordInput);
  }

  // Final check
  if (valid) {
    alert("Registration Successful!");
    form.reset();
  }
});