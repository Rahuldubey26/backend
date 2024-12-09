
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../model/User")

router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    const user = await User.findOne({ email });
    if (user) {
        return res.status(403).json("User with email already exist!!");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUserData = { name, email, password: hashPassword };

    const newUser = await User.create(newUserData);

    const token = getToken(email);
    const userToReturn = { ...newUser.json(), token }
    delete userToReturn.password;
    return res.status(200).json(userToReturn);
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user)
        return res.status(403).json("Invalid email address");

    const isPassword = await bcrypt.compare(password, user.password);

    if (!isPassword)
        return res.status(403).json("Invalid credentials");
    
    const token = getToken(user.email);
    const userToReturn={...user.toJSON(),token}
    delete userToReturn.password;
    return res.status(200).json(userToReturn);
})

module.exports = router;