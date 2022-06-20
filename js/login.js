const siteForm = document.querySelector(".site-form");
const usernameInput = document.querySelector("#usernameInput");
const passwordInput = document.querySelector("#passwordInput");

siteForm.addEventListener("submit", async (evt) => {
  evt.preventDefault();

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  const response = await fetch(HOST + "/login", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  });

  const data = await response.json();

  if (data?.token) {
    window.localStorage.setItem("token", data?.token);
    window.location.replace("index.html");
  }
});
