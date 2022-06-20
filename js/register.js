const siteForm = document.querySelector(".site-form");
const usernameInput = document.querySelector("#usernameInput");
const contactInput = document.querySelector("#contactInput");
const passwordInput = document.querySelector("#passwordInput");
const uploadInput = document.querySelector("#uploadInput");

siteForm.addEventListener("submit", async (evt) => {
  evt.preventDefault();

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();
  const contact = contactInput.value.trim();
  const file = uploadInput.files[0];

  const formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);
  formData.append("contact", contact);
  if (file) formData.append("avatar", file);

  const response = await fetch(HOST + "/register", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (data?.token) {
    window.localStorage.setItem("token", data?.token);
    window.location.replace("index.html");
  }
});
