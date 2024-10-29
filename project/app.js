const express = require("express");
const app = express();

require("dotenv").config();

const { User } = require("./db/models");

app.use(express.json());

app.post("/users/signup", async (req, res) => {
  const { firstName, lastName, email, username, password_hash } = req.body;
  const user = await User.create({
    firstName,
    lastName,
    email,
    username,
    password_hash,
  });
  res.json(user);
});

app.get("/", (req, res) => {
  res.json({ message: "success" });
});

const port = process.env.PORT || 5001;
app.listen(port, () => console.log("http://localhost:" + port));
