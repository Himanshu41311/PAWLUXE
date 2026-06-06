window.onload = () => {
  const animal = JSON.parse(localStorage.getItem("selectedAnimal"));
  if (!animal) {
    document.body.innerHTML = `<h2 style="text-align:center; margin-top:2rem;">Pet Not Found</h2>`;
    return;
  }

  const mediaList = animal.imageUrls || ["default-pet.jpg"];

  function formatAge({ ageInYear, ageInMonth }) {
    const y = ageInYear || 0, m = ageInMonth || 0;
    if (!y && !m) return "Not specified";
    let str = "";
    if (y) str += `${y} year${y > 1 ? 's' : ''}`;
    if (y && m) str += " ";
    if (m) str += `${m} month${m > 1 ? 's' : ''}`;
    return str;
  }

  function toTitleCase(str) {
    return str
      .replace(/[_-]/g, " ")
      .replace(/([A-Z])/g, " $1")
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
      .trim();
  }

  function renderMedia(url) {
    const mainMedia = document.getElementById("mainMedia");
    mainMedia.innerHTML = url.endsWith(".mp4") || url.endsWith(".webm")
      ? `<video src="${url}" controls autoplay muted playsinline></video>`
      : `<img src="${url}" alt="${toTitleCase(animal.name)}" />`;

    document.querySelectorAll(".media-thumbnails img, .media-thumbnails video").forEach(el => {
      el.classList.remove("selected");
      if (el.src === url || el.src.includes(url)) el.classList.add("selected");
    });
  }

  document.getElementById("petName").textContent = toTitleCase(animal.name || "Unknown");
  document.getElementById("petBreed").textContent = toTitleCase(animal.breed || "Mixed Breed");
  document.getElementById("petAge").textContent = formatAge(animal);
  document.getElementById("petGender").textContent = toTitleCase(animal.gender || "Unknown");
  document.getElementById("petPrice").textContent = animal.price
    ? `₹${Number(animal.price).toLocaleString('en-IN')}`
    : "Free Adoption";
  document.getElementById("petDescription").textContent = animal.description || "No description available.";

  const location = `${animal.ownerStreet || 'Unknown'}, ${animal.ownerCity || 'Unknown'}, ${animal.ownerState || 'Unknown'}`;
  const query = encodeURIComponent(location);

  // 🔹 Apply concept of 1 & 2
  if (animal.ownerType === 1) {
    // Individual
    document.getElementById("ownerInfo").innerHTML =
      animal.ownerName
        ? `Owner: ${sanitize(animal.ownerName)},<br> <a href="https://www.google.com/maps/search/${query}" target="_blank">${location}</a>`
        : "Owner info not available";
  } else if (animal.ownerType === 2) {
    // Organisation
    document.getElementById("ownerInfo").innerHTML =
      animal.organisationName
        ? `${sanitize(animal.organisationType)}: ${sanitize(animal.organisationName)},<br> <a href="https://www.google.com/maps/search/${query}" target="_blank">${location}</a>`
        : "Organisation info not available";
  } else {
    document.getElementById("ownerInfo").textContent = "Owner info not available";
  }

  renderMedia(mediaList[0]);
  const mediaThumbnails = document.getElementById("mediaThumbnails");
  mediaList.forEach(url => {
    const isVideo = url.endsWith(".mp4") || url.endsWith(".webm");
    const thumb = document.createElement(isVideo ? "video" : "img");
    thumb.src = url;
    thumb.alt = `${toTitleCase(animal.name)} thumbnail`;
    if (isVideo) thumb.muted = true;
    thumb.addEventListener("click", () => renderMedia(url));
    mediaThumbnails.appendChild(thumb);
  });
};

function sanitize(value) {
  return value
    ? String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
    : "";
}

function finalizeAdoption() {
  const animal = JSON.parse(localStorage.getItem("selectedAnimal"));
  alert(`Thank you for choosing to adopt ${animal.name}! We'll connect you with the owner soon.`);
  window.location.href = "../Homepage/index.html";
}
