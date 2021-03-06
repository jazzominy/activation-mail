# Simple api based service to send verification email and confirm a new account

This is a simple utility to send a verification email to a newly registered user and ask for confirmation by clicking the url sent in mail. JWT is used in url to verify user identity.

This is how config.json looks like

	{
		"mailConfig": {
			"smtpEmail": "abc@email.com", //gmail address to be used to send email using smtp.gmail.com
			"password": "*****", // gmail account password
			"fromEmail": "abc@email.com", //this is same as smtpEmail
			"subject": "subject for email",
			"body": "body for email"
		}
	}

The package used to send mail is node-mailer. Google smtp service is used by using the `smtpEmail` & `password` provided in `config.json` file.

## API

`/verifyAccount`

This api accepts POST method with the data in json format. Here is an example

	{
		"name": "John Doe",
		"email": "john@doe.com"
	}

The data has the information about the person whose account is to be verified. When the mail is sent successfully, folliwing response is returned

	{
		success: true,
		message: "Verification email sent successfully"
	}

`/confirm?token=xyz`

This api is called when user clicks the link that is provided in the verification email. Here `xyz` will be the actual token that is generated when verification mail is sent. The response is an html thank you template