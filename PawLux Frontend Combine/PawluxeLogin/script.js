let expectedOtp = null;
let isOtpVerified = false;

let isLoggedIn = false;
let currentUser = null;

document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const data = {
    userName: form.userName.value,
    password: form.password.value
  };

  try {
    const res = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await res.json();
    
    if (res.ok) {
      alert("Login successful" + JSON.stringify(result));

      // ✅ Track login state
      isLoggedIn = true;
      currentUser = result;
      // Optionally store in localStorage
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("currentUser", JSON.stringify(result));

      // Redirect or update UI
      window.location.href = "../HomePage/index.html";
    } else {
      alert(result.message || "Login failed");
    }
  } catch (err) {
    console.error("Login error", err);
    alert("Something went wrong.");
  }
});


document.getElementById("verifyEmailBtn").addEventListener("click", async () => {
  const email = document.getElementById("email").value;

  if (!email.includes("@")) {
    alert("Enter a valid email");
    return;
  }

  try {
    const res = await fetch("http://localhost:8080/api/auth/verifymail", {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: email
    });

    expectedOtp = await res.text();
    alert("OTP sent to your email.");
    document.getElementById("otpSection").style.display = "block";
  } catch (err) {
    console.error(err);
    alert("Failed to send OTP.");
  }
});

document.getElementById("submitOtpBtn").addEventListener("click", () => {
  const userOtp = document.getElementById("otpInput").value;

  if (userOtp === expectedOtp) {
    alert("Email verified successfully.");
    isOtpVerified = true; // ✅ Allow signup now
    document.getElementById("otpSection").style.display = "none";
  } else {
    alert("Invalid OTP. Please try again.");
  }
});

document.getElementById('signupForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!isOtpVerified) {
    alert("Please verify your email with OTP before signing up.");
    return;
  }

  const form = e.target;
  const data = {
    fullName: form.fullName.value,
    email: form.email.value,
    mobileNumber: form.mobileNumber.value,
    street: form.street.value,
    city: form.city.value,
    state: form.state.value,
    country: form.country.value,
    password: form.password.value,
    confirmPassword: form.confirmPassword.value
  };

  if (data.password !== data.confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  const res = await fetch('http://localhost:8080/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  const result = await res.text();
  alert(result || 'Signup complete');
  window.location.assign("login.html")
});



document.addEventListener("DOMContentLoaded", function () {
  const stateCityMap = {
    "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur"],
    "Arunachal Pradesh": ["Itanagar", "Naharlagun", "Pasighat"],
    "Assam": ["Guwahati", "Silchar", "Dibrugarh"],
    "Bihar": ["Patna", "Gaya", "Bhagalpur"],
    "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur"],
    "Goa": ["Panaji", "Margao", "Vasco da Gama"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara"],
    "Haryana": ["Gurgaon", "Faridabad", "Panipat"],
    "Himachal Pradesh": ["Shimla", "Manali", "Dharamshala"],
    "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad"],
    "Karnataka": ["Bengaluru", "Mysuru", "Mangalore"],
    "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode"],
    "Madhya Pradesh": ["Bhopal", "Indore", "Jabalpur"],
    "Maharashtra": ["Mumbai", "Pune", "Nagpur"],
    "Manipur": ["Imphal", "Thoubal"],
    "Meghalaya": ["Shillong", "Tura"],
    "Mizoram": ["Aizawl", "Lunglei"],
    "Nagaland": ["Kohima", "Dimapur"],
    "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela"],
    "Punjab": ["Ludhiana", "Amritsar", "Jalandhar"],
    "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur"],
    "Sikkim": ["Gangtok", "Namchi"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"],
    "Telangana": ["Hyderabad", "Warangal", "Karimnagar"],
    "Tripura": ["Agartala"],
    "Uttar Pradesh": ["Lucknow", "Noida", "Ghaziabad"],
    "Uttarakhand": ["Dehradun", "Haridwar", "Roorkee"],
    "West Bengal": ["Kolkata", "Siliguri", "Asansol"],
    "Andaman and Nicobar Islands": ["Port Blair"],
    "Chandigarh": ["Chandigarh"],
    "Dadra and Nagar Haveli and Daman and Diu": ["Daman", "Diu", "Silvassa"],
    "Delhi (NCT of Delhi)": ["New Delhi", "Dwarka", "Rohini"],
    "Jammu and Kashmir": ["Srinagar", "Jammu"],
    "Ladakh": ["Leh", "Kargil"],
    "Lakshadweep": ["Kavaratti"],
    "Puducherry": ["Puducherry", "Karaikal", "Mahe"]
  };

  const stateSelect = document.getElementById("stateSelect");
  const citySelect = document.getElementById("citySelect");

  // Populate all states
  stateSelect.innerHTML = '<option value="">Select State</option>';
  Object.keys(stateCityMap).sort().forEach(state => {
    const option = document.createElement("option");
    option.value = state;
    option.textContent = state;
    stateSelect.appendChild(option);
  });

  // Populate cities on state change
  stateSelect.addEventListener("change", function () {
    const selectedState = this.value;
    const cities = stateCityMap[selectedState] || [];

    // Clear and populate city dropdown
    citySelect.innerHTML = '<option value="">Select City</option>';
    cities.forEach(city => {
      const option = document.createElement("option");
      option.value = city;
      option.textContent = city;
      citySelect.appendChild(option);
    });
  });
});

