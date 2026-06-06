document.addEventListener("DOMContentLoaded", function () {
  let globalAnimals = [];
let currentPage = 0;
let pageSize = 20;
let lastPageReached = false;


  // 🗺️ State-City map
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

  // 🐾 Pet type to breed map
  const petBreedMap = {
    dog: ["Labrador Retriever", "German Shepherd", "Golden Retriever", "Bulldog", "Beagle", "Pomeranian"],
    cat: ["Persian", "Maine Coon", "Siamese", "Bengal", "British Shorthair", "Ragdoll"]
  };

  // 👤 Auth UI
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
  const authButtons = document.querySelector(".auth-buttons");

  if (!isLoggedIn || !currentUser) {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUser");
    authButtons.style.display = "flex";
  } else {
    authButtons.style.display = "flex";
    authButtons.innerHTML = "";
    
    const logoutBtn = document.createElement("button");
    logoutBtn.textContent = "Log Out";
    logoutBtn.className = "btn logout-btn";
    logoutBtn.onclick = () => {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("currentUser");
      window.location.reload();
    };

    authButtons.appendChild(logoutBtn);
  }
  
  // 🌐 Populate dropdowns
  const stateDropdown = document.getElementById("stateDropdown");
  const cityDropdown = document.getElementById("cityDropdown");

  Object.keys(stateCityMap).forEach(state => {
    stateDropdown.appendChild(new Option(state, state));
  });

  stateDropdown.addEventListener("change", () => {
    const cities = stateCityMap[stateDropdown.value] || [];
    cityDropdown.innerHTML = '<option value="">City</option>';
    cities.forEach(city => cityDropdown.appendChild(new Option(city, city)));
  });

  const petTypeDropdown = document.getElementById("petTypeDropdown");
  const breedDropdown = document.getElementById("breedDropdown");

  petTypeDropdown.addEventListener("change", () => {
    const breeds = petBreedMap[petTypeDropdown.value] || [];
    breedDropdown.innerHTML = '<option value="">Breed</option>';
    breeds.forEach(breed => {
      const val = breed.toLowerCase().replace(/\s+/g, '-');
      breedDropdown.appendChild(new Option(breed, val));
    });
    breedDropdown.disabled = breeds.length === 0;
  });

  // 🔎 Search handler
  document.querySelector(".search-btn").addEventListener("click", onSearchClick);

  // 🔁 Auto-search on page load
  onSearchClick();

  // 🔄 Helpers
  function getVal(id) {
    return document.getElementById(id).value.trim();
  }

  function sanitize(value) {
    return value
      ? String(value)
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
      : "";
  }

  // 🚀 Render animal cards
  function renderAnimals(animals, append = false) {
  if (!append) {
    globalAnimals = [];
    document.querySelector(".content").innerHTML = ""; // Clear only on fresh search
  }

  globalAnimals = [...globalAnimals, ...animals];
  const contentDiv = document.querySelector(".content");

    animals.forEach((animal, index) => {
      const card = document.createElement("div");
      card.className = "dog-card";

      card.innerHTML = `
        <div class="dog-card-header">
          <div class="dog-name">${sanitize(animal.name)}</div>
          <div class="posted-date">${animal.postedDate ? "Posted: " + animal.postedDate : ""}</div>
        </div>

        <img class="dog-image" src="${animal.imageUrls?.[0] || 'default.jpg'}" alt="Animal Image">

        <div class="dog-description">
          <strong>Breed:</strong> ${sanitize(animal.breed)}<br>
          <strong>Gender:</strong> ${sanitize(animal.gender)}<br>
          <strong>Price:</strong> ${sanitize(animal.price)} INR<br>
        </div>

        <div class="dog-footer">
          <div class="owner-detail"><strong>Location:</strong> ${sanitize(animal.ownerCity)}, ${sanitize(animal.ownerState)}</div>
          <button class="adopt-btn" onclick="goToPetDetails(${index})">Adopt</button>
        </div>
      `;

      contentDiv.appendChild(card);
    });
  }

  // 🐶 Adopt click
  window.goToPetDetails = function (index) {
    const selectedAnimal = globalAnimals[index];
    localStorage.setItem("selectedAnimal", JSON.stringify(selectedAnimal));
    window.location.href = "../petPage/pet.html";
  };

  // 📡 API call
  async function onSearchClick(reset = true) {
  if (reset) {
    currentPage = 0;
    lastPageReached = false;
  }

  if (lastPageReached) return;

  const filter = {
    token: currentUser?.token || "",
    type: getVal("petTypeDropdown"),
    breed: getVal("breedDropdown"),
    gender: getVal("petGenderDropdown"),
    state: getVal("stateDropdown"),
    city: getVal("cityDropdown")
  };

  try {
    const response = await fetch(`http://localhost:8081/view/data/conditions?page=${currentPage}&size=${pageSize}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(filter)
    });

    if (!response.ok) throw new Error("Failed to fetch data");
    const data = await response.json();

    renderAnimals(data.content, !reset);

    if (data.last) {
      lastPageReached = true;
    } else {
      currentPage++;
    }
  } catch (err) {
    console.error(err);
    document.querySelector(".content").innerHTML =
      `<p style="color:red;">Something went wrong. Please try again later.</p>`;
  }
}


window.addEventListener("scroll", () => {
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
    onSearchClick(false);
  }
});



  
  const addPetBtn = document.querySelector(".floating-add-pet-btn");
  if (isLoggedIn && currentUser && addPetBtn) {
    addPetBtn.style.display = "block";
  }


});
