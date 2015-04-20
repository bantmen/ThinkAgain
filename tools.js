/* General tools used by other files */

/* Define the globals here */
// i18n constants
var HOURS = chrome.i18n.getMessage('hours');

// Rest of the constants
var DELTA_T = 8000; // Time interval used in background.js

// Need this since time is recorded and saved in ms
function ms_to_hours(ms) {
	return ((ms/(1000*60*60)));
}

// hours with decimal points -> X hours Y minutes
function pretty_time(hours) {
	hours = parseFloat(hours);	// incase hours is a string
	var minutes = Math.floor(hours % 1 * 60); // Round it down and get rid of decimal points 
	hours = Math.floor(hours); 				   // Do the same for hours
	
	// Give the default values if not visited yet
	if (isNaN(hours)) hours = 0;
	if (isNaN(minutes)) minutes = 0;
	
	return hours + " " + HOURS + " " + minutes + " min";
}

// Simple regex matching to see if monitored fits nicely in url
function is_monitored(url, monitored) {
	var pattern = '(.)*' + monitored + '\.' + '(.)+';
	var re = new RegExp(pattern);
	return url.match(re) ? true : false;
}

// Gives the today's in the format: YYYY-MM-DD
function get_now(ms) {
	var d = (typeof ms === 'undefined') ? new Date() : new Date(ms); // make ms an optional argument
  d.setHours(0, -d.getTimezoneOffset(), 0, 0); // get rid of the offset since toJSON converts to GMT +0000
  return d.toJSON().slice(0,10);
}

// Used for i18n text setting
function set_text(id) {    // improve it to work with optional substitute strings
	var text = chrome.i18n.getMessage(id);
	document.getElementById(id).innerHTML = text;  // innerHTML instead of innerText
}



