let contacts = [];

const searchInput = document.getElementById("search");
const results = document.getElementById("results");

async function loadContacts() {
  const response = await fetch("/api/contacts");

  contacts = await response.json();

  renderContacts(contacts);
}

function renderContacts(data) {
  results.innerHTML = "";

  if (!data.length) {
    results.innerHTML = "<p>No contacts found.</p>";
    return;
  }

  data.forEach((contact) => {
    const card = document.createElement("div");

    card.className = "contact-card";

    card.innerHTML = `
      <div class="contact-header">

        <div>
          <div class="contact-name">
            ${contact.firstName} ${contact.lastName}
          </div>

          <div class="contact-email">
            ${contact.email}
          </div>
        </div>

        <button
          class="btn"
          onclick="showComment(${contact.id})">
          INTERESTED
        </button>

      </div>

      <div id="comment-${contact.id}"></div>
    `;

    results.appendChild(card);
  });
}

function showComment(id) {
  const area = document.getElementById(`comment-${id}`);

  area.innerHTML = `
    <div class="comment-box">

      <textarea
        id="txt-${id}"
        placeholder="Leave a comment..."
      ></textarea>

      <button
        class="btn"
        onclick="submitInterest(${id})">
        Submit
      </button>

      <div id="msg-${id}"></div>

    </div>
  `;
}

async function submitInterest(id) {
  const contact = contacts.find((c) => c.id === id);

  const comment = document.getElementById(`txt-${id}`).value.trim();

  if (!comment) {
    alert("Please enter a comment");
    return;
  }

  const response = await fetch("/api/interested", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contact,
      comment,
    }),
  });

  const result = await response.json();

  if (result.success) {
    document.getElementById(`msg-${id}`).innerHTML = `<div class="success">
        ✓ Saved Successfully
      </div>`;
  }
}

searchInput.addEventListener("input", () => {
  const term = searchInput.value.toLowerCase();

  const filtered = contacts.filter((contact) => {
    return (
      contact.firstName.toLowerCase().includes(term) ||
      contact.lastName.toLowerCase().includes(term)
    );
  });

  renderContacts(filtered);
});

loadContacts();
