let expectedOtp = null;
let isOtpVerified = false;

document.addEventListener("DOMContentLoaded", function () {
  const accountTypeSelect = document.getElementById("accountType");
  const organisationFields = document.getElementById("organisationFields");
  const fullNameInput = document.querySelector("input[name='fullName']");
  const organisationTypeSelect = document.getElementById("organisationType");
  const organisationNameInput = document.querySelector("input[name='organisationName']");

  // Toggle fields based on account type
  accountTypeSelect.addEventListener("change", function () {
    if (this.value === "organisation") {
      organisationFields.style.display = "block";
      organisationTypeSelect.setAttribute("required", "required");
      organisationNameInput.setAttribute("required", "required");
      fullNameInput.removeAttribute("required");
      fullNameInput.style.display = "none"; // hide full name for org
    } else {
      organisationFields.style.display = "none";
      organisationTypeSelect.removeAttribute("required");
      organisationNameInput.removeAttribute("required");
      fullNameInput.setAttribute("required", "required");
      fullNameInput.style.display = "block"; // show full name for individual
    }
  });

  // OTP verification - send OTP
  document.getElementById("verifyEmailBtn")?.addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();
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
      if(res.ok){
      alert("OTP sent to your email.");
      document.getElementById("otpSection").style.display = "flex";
      }
      else{
        alert(JSON.stringify(expectedOtp));
      }
    } catch {
      alert("Failed to send OTP.");
    }
  });

  // OTP verification - submit OTP
  document.getElementById("submitOtpBtn")?.addEventListener("click", () => {
    const userOtp = document.getElementById("otpInput").value.trim();
    if (userOtp === expectedOtp) {
      alert("Email verified successfully.");
      isOtpVerified = true;
      document.getElementById("otpSection").style.display = "none";
    } else {
      alert("Invalid OTP. Please try again.");
    }
  });

  // Signup form submission
  document.getElementById("signupForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!isOtpVerified) {
      alert("Please verify your email before signing up.");
      return;
    }

    const form = e.target;

    // Mobile number validation
    const mobilePattern = /^[0-9]{10}$/;
    if (!mobilePattern.test(form.mobileNumber.value.trim())) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    // Organisation validation
    if (form.accountType.value === "organisation") {
      if (!form.organisationType.value) {
        alert("Please select an organisation type.");
        return;
      }
      if (!form.organisationName.value.trim()) {
        alert("Please enter your organisation name.");
        return;
      }
    }

    // Prepare data object
    const data = {
      fullName: form.accountType.value === "organisation" ? null : form.fullName.value,
      accountType: form.accountType.value == "organisation" ? 2 : 1,
      organisationType: form.accountType.value === "organisation" ? form.organisationType.value : null,
      organisationName: form.accountType.value === "organisation" ? form.organisationName.value : null,
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

    try {
      const res = await fetch('http://localhost:8080/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await res.text();
      alert(result || 'Signup complete');
      window.location.assign("login.html");
    } catch {
      alert("Something went wrong during signup.");
    }
  });

  // State-City dropdown setup
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

  stateSelect.innerHTML = '<option value="">Select State</option>';
  Object.keys(stateCityMap).sort().forEach(state => {
    const opt = document.createElement("option");
    opt.value = state;
    opt.textContent = state;
    stateSelect.appendChild(opt);
  });

  stateSelect.addEventListener("change", function () {
    const selectedState = this.value;
    const cities = stateCityMap[selectedState] || [];
    citySelect.innerHTML = '<option value="">Select City</option>';
    cities.forEach(city => {
      const opt = document.createElement("option");
      opt.value = city;
      opt.textContent = city;
      citySelect.appendChild(opt);
    });
  });
});
