/* 
	Makes sure that all the initializations are done
*/
function setup() {
	// Put in the default values until initialized
	// Quick solution since localStorage only stores strings
	// Storage.prototype.setVal = function(key, val) {
	// 	console.log(this);
	// 	console.log(key);
	// 	console.log(val);
	// 	console.log(arguments);
	// 	// Base Case when 1 key and 1 val
	// 	if (arguments.length == 2) {
 //  		return this.setItem(key, JSON.stringify(val));
 //  	}
 //  	// Else, multiple keys and 1 val
 //  	else {
 //  		// Use the first key and then recursively call the rest
 //  		var cur_key = arguments[0];
 //  		var rem_args = Array.prototype.slice.call(arguments, 1);
 //  		return Storage.prototype.setVal.apply(this.getVal(cur_key), rem_args); 
 //  	}
	// }
	Storage.prototype.setVal = function(key, val) {
  		var val = JSON.stringify(Array.prototype.pop.call(arguments));
  		var cur_depth = this;
  		for (var i in arguments) {
  			var cur_key = arguments[i];
  			cur_depth = JSON.parse(cur_depth[cur_key]);
  		}
  		cur_depth = JSON.stringify(val);
	}
	Storage.prototype.getVal = function(key) {
		return JSON.parse(this.getItem(key));
	}
	if (!localStorage['period'])     localStorage['period'] = 0;
	if (!localStorage['last_popup']) localStorage.setVal('last_popup', {});
}

/*
	Checks whether the newly launched website is in our list 
	or not, and if so then prompts the dialog.
*/
function check_page(url) {
	chrome.storage.sync.get({pages: []}, function(result) {
		var webpages = result.pages;
		console.log(webpages);
		var current;
		for (var i=0; i<webpages.length; i++) {
			current = webpages[i];
			if (is_monitored(url, current) && is_ready(current)) {
				// Update the last popped at time to be now
				var now = new Date();
				localStorage['last_popup'][current] = now.getTime(); // save in ms 		
				confirm_close(current, confirm_proceed);
			}
		}
	});
}

/*
	Gets the confirm_string ready and then passes url, callback and confirm_string to
	think_again.
*/
function confirm_close(url, callback) {
	chrome.storage.sync.get({time_dict: {}, date_time_dict: {}}, 
		function(result) {
			var timers = result.time_dict;
			var date_timers = result.date_time_dict;
			var now = get_now();
			var today = new Date();
			var today_spent = date_timers[now] ? pretty_time(ms_to_hours(date_timers[now][url])) : "ERROR";
			
			var week_spent = 0;
			var cur_ms;
			var cur_date;
			console.log(today);
			for (var i=0; i<7; i++) {
				cur_ms = today.setDate(today.getDate()-i);
				cur_date = get_now(cur_ms);
				if (date_timers[cur_date]) {
					if (date_timers[cur_date][url]) {
						week_spent += date_timers[cur_date][url];
					}
				}
			}
    	week_spent = pretty_time(ms_to_hours(week_spent));
		var str_builder = [];
		str_builder.push('<div align="justify">',
										 'Time spent on ', url, ': ',
										 '<br>Today: ', today_spent, 
										 '<br>Past 7 days: ', week_spent,
										 '<br>Are you sure that you want to continue?',
										 '</div>');
		var confirm_string = str_builder.join("");
		console.log(confirm_string);

		think_again(url, confirm_string, callback); // Trigger the non-blocking confirmation box.

		}
	);
}

/* 
	Noty based non-blocking confirmation box. Returns callback 
	with true or false depending on the button click.
*/
function think_again(url, confirm_string, callback) {
  var n = noty({
        text: confirm_string,
        type: 'confirm',
        dismissQueue: false,
        layout: 'center',
        theme: 'relax',
 				buttons: [
			    // If Continue button
			    {addClass: 'large green button', text: 'Continue', onClick: function($noty) {
			    	callback(true, url);
			        $noty.close();
			      }
			    },
			    // Else If Exit button
			    {addClass: 'large red button', text: 'Exit', onClick: function($noty) {
			        callback(false, url);
			        $noty.close();
			      }
			    }
			  ]
    })
}

/*
	Takes the return value of the confirmation box and acts accordingly.
	Called as the callback function.
*/
function confirm_proceed(confirmed, url) {
	if (confirmed) {
		console.log('cont.');
		chrome.runtime.sendMessage({
			action: "resume_timer", url: url 
		}, function(response) {
	  		console.log('response:');
	  		console.log(response.reaction);
		});
	}
	else {
		console.log('not cont.');
		chrome.runtime.sendMessage({
			action: "close_current_tab", url: url
		}, function(response) {
	  		console.log('response:');
	  		console.log(response.reaction);
		});
	}
}


setup(); 

var current_page = window.location.href;
check_page(current_page);
