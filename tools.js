/* General tools used by other files */

function ms_to_hours(ms) {
	return ((ms/(1000*60*60)));
}

function is_monitored(url, monitored) {
	var pattern = '(.)*'+monitored+'\.'+'(.)+';
	var re = new RegExp(pattern);
	return url.match(re) ? true : false;
}

