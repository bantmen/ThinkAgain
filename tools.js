/* General tools used by other files */

/* Define the globals here */
// Set the translated constant variables
var HOURS = chrome.i18n.getMessage('hours');
// Time interval used in background.js
var DELTA_T = 8000;

// Used since time is recorded and saved in ms
function ms_to_hours(ms) {
	return ((ms/(1000*60*60)));
}

// hours with decimal points -> X hours Y minutes
function pretty_time(hours) {
	console.log("time input: " + hours);
	hours = parseFloat(hours);	// incase hours is a string
	var minutes = Math.floor(hours % 1 * 60); // Round it down and get rid of decimal points 
	hours = Math.floor(hours); 				   // Do the same for hours
	return hours + " hours " + minutes + " minutes";
}

// X ms -> Y hours Z minutes
function ms_to_hours_minutes(ms) {
	var hours = ms_to_hours(ms).toFixed(2);
	var minutes = (hours % 1 * 60).toFixed(0); // Round it down and get rid of decimal points 
	hours = Math.floor(hours); 				   // Do the same for hours
	return hours + " hours " + minutes + " minutes";
}

// Simple regex matching to see if monitored fits nicely in url
function is_monitored(url, monitored) {
	var pattern = '(.)*'+monitored+'\.'+'(.)+';
	var re = new RegExp(pattern);
	return url.match(re) ? true : false;
}

// Doesn't work in some rare edge cases?
function get_now(ms) {
	// make ms an optional argument
	return  (typeof ms === 'undefined') ? new Date().toJSON().slice(0, 10)
										: new Date(ms).toJSON().slice(0, 10);
}

// Used for i18n text setting
function set_text(id) {  // improve it to work with optional substitute strings
	var text = chrome.i18n.getMessage(id);
	document.getElementById(id).innerHTML = text;  // innerHTML instead of innerText
}



