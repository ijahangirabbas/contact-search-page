const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));
app.use(express.static(path.join(__dirname, "public")));

const CONTACTS_FILE = path.join(__dirname, "contacts.json");
const SUBMISSIONS_FILE = path.join(__dirname, "submissions.json");

// Create submissions file if missing
if (!fs.existsSync(SUBMISSIONS_FILE)) {
  fs.writeFileSync(SUBMISSIONS_FILE, "[]");
}

// Get Contacts
app.get("/api/contacts", (req, res) => {
  try {
    const contacts = JSON.parse(fs.readFileSync(CONTACTS_FILE, "utf8"));

    res.json(contacts);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Unable to load contacts",
    });
  }
});

// Save Interest
app.post("/api/interested", (req, res) => {
  try {
    const { contact, comment } = req.body;

    if (!contact || !comment) {
      return res.status(400).json({
        success: false,
        message: "Missing data",
      });
    }

    const submissions = JSON.parse(fs.readFileSync(SUBMISSIONS_FILE, "utf8"));

    submissions.push({
      ...contact,
      comment,
      timestamp: new Date().toISOString(),
    });

    fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2));

    res.json({
      success: true,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
    });
  }
});

// View Submissions
app.get("/api/interested", (req, res) => {
  try {
    const submissions = JSON.parse(fs.readFileSync(SUBMISSIONS_FILE, "utf8"));

    res.json(submissions);
  } catch (err) {
    res.status(500).json({
      success: false,
    });
  }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
