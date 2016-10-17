var logger = require("../../lib/logger"),
    config = require("../../config.json"),
    Handlebars = require("handlebars"),
    mail = require("../../lib/mail"),
    tokenService = require("../../lib/service/token"),
    fs = require("fs"),
    EventEmitter = require("events").EventEmitter,
    user = {name:"User",email:"abc@def.com"},
    confirmUrl = "http://localhost:3001/confirm?token=xyz",
    dispatcher = new EventEmitter(),
    template = null,
    callback = null;

function getMailTemplate(){
    fs.readFile("lib/mailer.hbs",function(err,data){
        if(err)
        {
            logger.error(err);
            return;
        }
        
        template = data.toString();
        dispatcher.emit("templateRead");
    });
}

function compileTemplateAndMail(){
    var source = template;
	var templateWrapper = Handlebars.compile(source);
    
    var confirmUrl = tokenService.generateUrl(user);
    var context = {
        name: user.name,
        url: confirmUrl,
        body: config.mailConfig.body
    };
    
	var result = templateWrapper(context);
    
    config.mailConfig.template = result;
    logger.info("Mailer ready to be sent");
    
    if(user.email)
        config.mailConfig.toEmail = user.email;
    
    mailTemplate(config.mailConfig,callback);
}

function mailTemplate(config,callBack){
    mail(config,callBack);
}

function sendVerificationMail(req, res){
    
    var data = req.body;
    
    if(!data || !data.hasOwnProperty("name"))
    {
        res.status(400).send({success:false,message:"Please provide user information to verify"});
        return;
    }
    
    if(data)
    {
        user = data;
    }
    
    var cb = function(error,info) {
        if(info)
            res.status(200).send({success:true,message:"Verification email sent successfully"});
        else//error
            res.status(500).send({success:false,message:"Verification email could not be sent"});
    }
    
    callback = cb;
    
    //Once template is read, compile it. Event is dispatched from getMailTemplate()
    dispatcher.once("templateRead",compileTemplateAndMail);
    getMailTemplate();
}

function confirmAccount(req, res){
    var token = req.query.token;
    
    if(!template)
    {
        //Once template is read, the proceed
        dispatcher.once("templateRead",function(){
            confirmAccount(req,res);
        });
        
        getMailTemplate();
        return;
    }
    
    if(token)
    {
      var validToken = tokenService.isTokenValid(token);
      var source = template;
      var templateWrapper = Handlebars.compile(source);

      var context = {
            name: user.name,
            url: null,
            body: "Thank you for verifying your email address"
      };

      var responseText = "";

      if(!validToken)
      {
        logger.info("The token has expired");   
        context.body = "The url for email verification has expired";
        responseText = templateWrapper(context);
      }
      else
      {
          logger.info("Account verified");
          responseText = templateWrapper(context);
      }

      res.status(200).send(responseText);
    }
    else
      logger.info("No token found in request url");
}

module.exports = {
    sendVerificationMail: sendVerificationMail,
    confirmAccount: confirmAccount
}