# Simple api based service to send verification email and confirm a new account

This is a simple utility to send a verification email to a newly registered user and ask for confirmation by clicking the url sent in mail. JWT is used in url to verify user identity.

This is how config.json looks like

	{
		"mailConfig": {
			"smtpEmail": "abc@email.com", //gmail address to be used to send email using smtp.gmail.com
			"password": "*****", // gmail account password
			"fromEmail": "abc@email.com", //this is same as smtpEmail
			"toEmail": "xyz@email.com", //recepient (can have comma separated email ids)
			"subject": "subject for email",
			"body": "body for email"
		}
	}

The package used to send mail is node-mailer. Google smtp service is used by using the `smtpEmail` & `password` provided in `config.json` file.