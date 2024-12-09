const express = require("express")
const app = express();
const User = require("./model/User")
const authSignup = require("./routes/auth");
require('dotenv').config();
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const cors = require("cors");
const passport = require("passport");

const mongoose = require("mongoose");
app.use(express.json());
app.use(cors())

const PORT = 8080
const URL = process.env.MONGO_URI;
mongoose.connect(URL).then(console.log("MongoDB connected"));

let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.Key;

passport.use(new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
        // Use async/await instead of callback for findOne
        const user = await User.findOne({ _id: jwt_payload.sub });

        if (user) {
            return done(null, user); // User found
        } else {
            return done(null, false); // User not found
        }
    } catch (err) {
        return done(err, false); // Error during query
    }
}));


app.get("/", (req, res) => {
    return res.json("Hello");
})

app.use("/auth", authSignup);

app.listen(PORT, () => {
    console.log("Server start at PORT 8080");
})