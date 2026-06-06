document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const data = {
    accountType: form.accountType.value == "organisation" ? 2 : 1,
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
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("currentUser", JSON.stringify(result));
      window.location.href = "../index.html";
    } else {
      alert(result.message || "Login failed");
    }
  } catch (err) {
    console.error("Login error", err);
    alert("Something went wrong.");
  }
});
