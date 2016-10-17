var jwt = require("jwt-simple");
var moment = require("moment");
var secret = "This secret has to be a long string and cant be guessed easily";

function generateUrl(data){
    var payload = {
        sub: data.email,
        iat: moment().unix(),//issued at time
        exp: moment().add(14, "days").unix()//expire time for token
    }

    return "http://localhost:3001/confirm?token="+jwt.encode(payload,secret);
}

function isTokenValid(token){
    var payload = jwt.decode(token,secret);
    
    return payload.exp >= moment().unix();
}

module.exports = {
    generateUrl: generateUrl,
    isTokenValid: isTokenValid
}