/*  
  Sets translated text based on user's language 
*/
function set_all_text() {
	set_text('popupTitle');
	set_text('popupTitleExp');
	set_text('popupBottom');
	
}

/* 
  Updates the contents of the popup according to the latest data.
*/
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
  			// current_hours = ms_to_hours(current_timer).toFixed(2);
        time_display = pretty_time(ms_to_hours(current_timer));
  			// if (isNaN(current_hours)) current_hours = '0.00';
  			// updated_text_build.push(current_website, ' : ', 
  			// 				 							  time_display, ' ', HOURS, 
  			// 				 							  '\n');
        updated_text_build.push('<strong>', current_website, ': </strong>', 
                                time_display,'<br>');
  		}
  		var updated_text = updated_text_build.join("");
  		// console.log(updated_text);
  		if (updated_text) {
  			// document.getElementById('status').innerText = updated_text;
        $("#status").html(updated_text);
  		}
  		else {
  			document.getElementById('status').innerText = 'No websites are currently being tracked.';	
  		}
  	}
  );
}

document.addEventListener('DOMContentLoaded', set_all_text());
document.addEventListener('DOMContentLoaded', update_current());
