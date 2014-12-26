/* General tools used by other files */

/* Define the globals here */
// Set the translated constant variables
var HOURS = chrome.i18n.getMessage('hours');
// Time interval used in background.js
var DELTA_T = 6000;

// Used since time is recorded and saved in ms
function ms_to_hours(ms) {
	return ((ms/(1000*60*60)));
}

// Used for i18n text setting
function set_text(id) {
	var text = chrome.i18n.getMessage(id);
	document.getElementById(id).innerText = text;
}

// Simple regex matching to see if monitored fits nicely in url
function is_monitored(url, monitored) {
	var pattern = '(.)*'+monitored+'\.'+'(.)+';
	var re = new RegExp(pattern);
	return url.match(re) ? true : false;
}

