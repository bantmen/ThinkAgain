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
  			updated_text_build.push(current_website, ' : ', 
  							  current_hours, ' hours\n');
  		}
  		console.log(updated_text_build.join());
  		document.getElementById('status').innerText = updated_text_build.join('');
  	}
  );
}

document.addEventListener('DOMContentLoaded', update_current());
