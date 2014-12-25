// Set the translated constants
var HOURS = chrome.i18n.getMessage('hours');

// Sets translated text based on user's language
function set_all_text() {
	function set_text(id) {
		var text = chrome.i18n.getMessage(id);
		document.getElementById(id).innerText = text;
	}
	set_text('popupTitle');
	set_text('popupTitleExp');
	// set_text('popupBottom');
}

function update_current() {
  chrome.storage.sync.get({pages: [], time_dict: {}}, 
  	function(result) {
  		var websites = result.pages;
  		var timers = result.time_dict;
  		var updated_text_build = [];
  		var current_website;
  		var current_timer;
  		for (var i=0; i<websites.length; i++) {
  			current_website = websites[i];
  			current_timer = timers[current_website];
  			current_hours = (current_timer/1000/60/60).toFixed(2);
  			if (isNaN(current_hours)) current_hours = '0.00';
  			updated_text_build.push(current_website, ' : ', 
  							 							  current_hours, ' ', HOURS, 
  							 							  '\n');
  		}
  		var updated_text = updated_text_build.join("");
  		console.log(updated_text);
  		if (updated_text) {
  			document.getElementById('status').innerText = updated_text;
  		}
  		else {
  			document.getElementById('status').innerText = 'No websites are currently being tracked.';	
  		}
  	}
  );
}

document.addEventListener('DOMContentLoaded', set_all_text());
document.addEventListener('DOMContentLoaded', update_current());
