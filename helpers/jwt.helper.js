const jwt = require("jsonwebtoken");

module.exports.accessToken = async (payload) => {
    const access_token = jwt.sign(payload, "access_tokenfsf" ,{ expiresIn: "15s"});
    return access_token;
}

module.exports.refreshToken  = async(payload) => {
    const refresh_token = jwt.sign(payload, "access_tokenfsf", {expiresIn: "7d"})
    return refresh_token;
}
