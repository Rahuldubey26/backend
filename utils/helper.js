const jwt = require('jsonwebtoken');
async function getToken(email) {
    const token = jwt.sign({
        sub: email._id,
    },
        process.env.Key,
    );
    return token;
}

module.exports = { getToken };