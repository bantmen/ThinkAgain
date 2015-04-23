/* General tools used by other files */

/* Define the globals here */
// i18n constants
var HRS = chrome.i18n.getMessage('hours');
var MIN = "min";
// Rest of the constants
var DELTA_T = 8000; // Time interval used in background.js

// Need this since time is recorded and saved in ms
function ms_to_hours(ms) {
	return ms / (1000 * 60 * 60);
}

function min_to_ms(min) {
	return min * 60 * 1000;
}

// hours with decimal points -> X hours Y minutes
function pretty_time(hours) {
	hours = parseFloat(hours);	// incase hours is a string
	var minutes = Math.floor(hours % 1 * 60); // Round it down and get rid of decimal points 
	hours = Math.floor(hours); 				   // Do the same for hours
	
	// Give the default values if not visited yet
	if (isNaN(hours)) hours = 0;
	if (isNaN(minutes)) minutes = 0;
	
	return hours + " " + HRS + " " + minutes + " " + MIN;
}

// Simple regex matching to see if page fits nicely in url
function is_monitored(url, page) {
	var pattern = '(.)*' + page + '\.' + '(.)+';
	var re = new RegExp(pattern);
	return url.match(re) ? true : false;
}

// Checks whether the page website is ready for the confirmation box
// This depends on the period settings under options
function is_ready(page) {
	var period = localStorage['period'];
	var last_popped_at = localStorage['last_popup'][page];
	var now = new Date();
	now = now.getTime();
	console.log("now: " + now);
	console.log("2: " + last_popped_at);
	return !last_popped_at || now - last_popped_at >= period ;
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



