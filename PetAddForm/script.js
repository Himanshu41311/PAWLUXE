const petBreedMap = {
  dog: [
    "Stray", "Labrador Retriever", "German Shepherd", "Golden Retriever",
    "Bulldog", "Beagle", "Pomeranian", "Unknown"
  ],
  cat: [
    "Stray", "Persian", "Maine Coon", "Siamese",
    "Bengal", "British Shorthair", "Ragdoll", "Unknown"
  ]
};

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

const imageInput = document.getElementById("imageInput");
const previewContainer = document.getElementById("previewContainer");
const form = document.getElementById("animalForm");

let imageUrls = [];

imageInput.addEventListener("change", async (e) => {
  const files = Array.from(e.target.files);
  for (const file of files) {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:8081/api/images/upload", {
        method: "POST",
        body: formData,
      });

      const imageUrl = await res.text();
      imageUrls.push(imageUrl);

      const img = document.createElement("img");
      img.src = imageUrl;
      img.style.height = "120px";
      img.style.margin = "5px";
      previewContainer.appendChild(img);
    } catch (err) {
      console.error("Upload failed", err);
    }
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (imageUrls.length === 0) {
    alert("Please upload at least one image before submitting.");
    return;
  }

  const submitButton = form.querySelector("button[type='submit']");
  submitButton.disabled = true;

  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
  let  data = {
      name: form.name.value,
      type: petTypeDropdown.value,
      breed: breedDropdown.value,
      gender: form.petGenderDropdown.value,
      ageInMonth: parseInt(form.ageInMonth.value) || 0,
      ageInYear: parseInt(form.ageInYear.value) || 0,
      description: form.description.value,
      price: parseFloat(form.price?.value) || 0,
      imageUrls: imageUrls,
      ownerType:parseInt(currentUser.user.accountType),//1 for individual and 2 for organisation
      organisationName:currentUser.user.organisationName || "",
      organisationType:currentUser.user.organisationType || "",
      ownerName: currentUser.user.fullName || "",
      ownerMail: currentUser.user.email || "",
      ownerContactNumber: currentUser.user.mobileNumber || "",
      ownerStreet: currentUser.user.street || "",
      ownerCity: currentUser.user.city || "",
      ownerState: currentUser.user.state || "",
      ownerCountry: currentUser.user.country || "",
    };

  try {
    const res = await fetch("http://localhost:8081/api/animal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const msg = await res.text();
    alert(msg);
    form.reset();
    previewContainer.innerHTML = "";
    imageUrls = [];
  } catch (err) {
    console.error("Submit failed", err);
    alert("Failed to submit animal. Try again.");
  } finally {
    submitButton.disabled = false;
  }
});
