window.onload = () => {
  const animal = JSON.parse(localStorage.getItem("selectedAnimal"));
  if (!animal) {
    document.body.innerHTML = "<p>Sorry, pet not found. Please go back and try again.</p>";
    return;
  }

  const mediaList = animal.imageUrls || [];

  // Format age/gender/owner
  function formatAge(animal) {
    const y = animal.ageInYear, m = animal.ageInMonth;
    if (!y && !m) return "Not specified";
    let str = "";
    if (y) str += `${y} year${y > 1 ? 's' : ''}`;
    if (y && m) str += " ";
    if (m) str += `${m} month${m > 1 ? 's' : ''}`;
    return str;
  }

  function renderMedia(url) {
    const mainMedia = document.getElementById("mainMedia");
    mainMedia.innerHTML = url.endsWith(".mp4") || url.endsWith(".webm")
      ? `<video src="${url}" controls autoplay muted></video>`
      : `<img src="${url}" alt="Pet image" />`;

    document.querySelectorAll(".media-thumbnails img, .media-thumbnails video").forEach(el => {
      el.classList.remove("selected");
      if (el.src === url) el.classList.add("selected");
    });
  }

  // Set pet details in correct order
  document.getElementById("petName").textContent = animal.name;
  document.getElementById("petBreed").textContent = `Breed: ${animal.breed}`;
  document.getElementById("petAgeGender").textContent = `${formatAge(animal)} • ${animal.gender}`;
  document.getElementById("petPrice").textContent = animal.price ? `${animal.price} INR` : "Free";
  document.getElementById("petDescription").textContent = animal.description;

  const mapQuery = encodeURIComponent(`${animal.ownerCity}, ${animal.ownerState}`);
  document.getElementById("ownerInfo").innerHTML =
    `Owner: ${animal.ownerName}, <a href="https://www.google.com/maps/search/${mapQuery}" target="_blank">${animal.ownerCity}, ${animal.ownerState}</a>`;

  // Render thumbnails
  const mediaThumbnails = document.getElementById("mediaThumbnails");
  renderMedia(mediaList[0] || "default.jpg");

  mediaList.forEach(url => {
    const thumb = document.createElement(url.endsWith(".mp4") || url.endsWith(".webm") ? "video" : "img");
    thumb.src = url;
    thumb.alt = "Media thumbnail";
    if (thumb.tagName === "VIDEO") thumb.muted = true;
    thumb.addEventListener("click", () => renderMedia(url));
    mediaThumbnails.appendChild(thumb);
  });
};

function finalizeAdoption() {
  alert("Thank you for choosing to adopt ❤️ We'll connect you with the owner.");
}
