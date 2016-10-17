var bunyan = require("bunyan");

var logger = null;

function getLogger(){
	if(logger)
		return logger;

	logger = bunyan.createLogger({
		name: "activation-mail",
		level: bunyan.INFO,
		streams: [
	        {
	            level: bunyan.INFO,
	            stream: process.stdout
	        },
	        {
	        	type: "rotating-file",
	            level: bunyan.INFO,
	            path: "./info.log",
	            period: '1d',   // daily rotation
        		count: 2 //No. of backup copies
	        }
        ]
	});

	return logger;
}

module.exports = getLogger();