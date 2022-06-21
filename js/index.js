const elUsersList = document.querySelector(".chats-list");
const elUserTemplate = document.querySelector("#user-template").content;
const profileAvatar = document.querySelector(".profile-avatar");
const profileName = document.querySelector(".profile-name");

const messagesList = document.querySelector(".chat-main-inner");
const messageTemplate = document.querySelector("#msg-template").content;

const uploadedList = document.querySelector(".uploaded-file");
const uploadedFileTemplate = document.querySelector("#uploaded-file-template").content;

const chatForm = document.querySelector(".chat-footer");
const chatTextInput = document.querySelector("#textInput");
const chatfileInput = document.querySelector("#uploads");

const client = io("http://localhost:6500", { transports: ["websocket", "polling"] });

const checkToken = () => {
  if (!TOKEN) window.location.replace("login.html");
};

const normalizeTime = (time) => {
  const date = new Date(time);

  const hours = date.getHours();
  const minutes = date.getMinutes();

  return hours + ":" + minutes;
};

const renderUsers = async () => {
  const response = await fetch(HOST + "/users", {
    headers: {
      token: TOKEN,
    },
  });

  const data = await response.json();

  if (!data?.data) return;

  data?.data.forEach((user) => {
    const template = elUserTemplate.cloneNode(true);

    if (user.avatar) template.querySelector("img").src = user.avatar;
    template.querySelector("p").textContent = user.username;

    elUsersList.append(template);
  });

  const profile = data?.data.find((user) => user.id === data?.userId);

  if (profile.avatar) profileAvatar.src = profile.avatar;
  profileName.textContent = profile.username;
};

const renderMessage = (data) => {
  data?.data.forEach((message) => {
    const template = messageTemplate.cloneNode(true);
    const uploadedTemplate = uploadedFileTemplate.cloneNode(true);

    if (message.message_file) {
      uploadedTemplate.querySelector("a").href = message.message_file.download_link;
      uploadedTemplate.querySelector("img").src = message.message_file.show_link;
      uploadedTemplate.querySelector("p").textContent = message.message_file.name;

      uploadedList.appendChild(uploadedTemplate);
    }

    if (message.user.id == data?.userId) {
      template.querySelector(".msg-wrapper").classList.add("msg-from");
    }

    template.querySelector(".msg-author").textContent = message.user.username;

    if (message.user.avatar) template.querySelector(".msg-profile").src = message.user.avatar;

    if (message.message_file || message.message_text) {
      const div = document.createElement("div");
      const object = document.createElement("object");
      const p = document.createElement("p");
      const a = document.createElement("a");
      const img = document.createElement("img");

      div.classList.add("msg-inner");
      object.classList.add("object-class");
      p.classList.add("msg");
      a.classList.add("msg-download");
      img.src = "./img/download.png";
      img.width = "25";

      if (message.message_file) {
        object.data = message.message_file.show_link;

        div.append(object);
      }

      if (message.message_text) {
        p.textContent = message.message_text;

        div.append(p);
      }

      if (message.message_file) {
        a.href = message.message_file.download_link;

        a.append(img);

        div.append(a);
      }

      template.querySelector(".msg-text").append(div);
    }

    template.querySelector(".time").textContent = normalizeTime(message.message_date);

    messagesList.append(template);
  });
};

const renderMessages = async () => {
  const response = await fetch(HOST + "/messages", {
    headers: {
      token: TOKEN,
    },
  });

  const data = await response.json();

  if (!data?.data) return;

  messagesList.innerHTML = null;
  uploadedList.innerHTML = null;

  renderMessage(data);
};

chatForm.addEventListener("submit", async (evt) => {
  evt.preventDefault();

  const text = chatTextInput.value.trim();
  const file = chatfileInput.files[0];

  if (text == "" || file) return;

  const formData = new FormData();

  if (text) formData.append("message_text", text);
  if (file) formData.append("file", file);

  const data={
    data:{

    }
  }

  client.emit("new message", { token: TOKEN, message: text });

  messagesList.scrollTop = messagesList.scrollHeight;

  chatTextInput.value = null;
});

client.on("send message", (data) => {
  
});

renderUsers();
renderMessages();
checkToken();
