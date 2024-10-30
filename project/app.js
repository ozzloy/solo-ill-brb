const express = require("express");
const app = express();

require("dotenv").config();

const { User } = require("./db/models");

app.use(express.json());

app.post("/users/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, username, password_hash } = req.body;
    const user = await User.create({
      firstName,
      lastName,
      email,
      username,
      password_hash,
    });
    res.json(user);
  } catch (error) {
    let emailExists = false;
    let userNameExists = false;

    error.errors.forEach((error) => {
      if (error.message === "username must be unique") {
        userNameExists = true;
      }

      if (error.message === "email must be unique") {
        emailExists = true;
      }
    });

    let resObj = {
      message: "User already exists",
      errors: {},
    };

    if (emailExists) {
      resObj.errors["email"] = "User with that email already exists";
    }

    if (userNameExists) {
      resObj.errors["username"] = "User with that username already exists";
    }

    res.status(500).json(resObj);
  }
});

app.get("/", (req, res) => {
  res.json({ message: "success" });
});

const port = process.env.PORT || 5001;
app.listen(port, () => console.log("http://localhost:" + port));
