var logger = require("./lib/logger"),
    mailService = require("./lib/service/verification"),
    app = require("express")(),
    bodyParser = require('body-parser');

//Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/verifyAccount", mailService.sendVerificationMail);
app.get('/confirm', mailService.confirmAccount);

app.listen(3001,function(err,result){
    logger.info("server running at port 3001");
});