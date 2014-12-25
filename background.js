var DELTA_T = 6000;

/*
* Listens for the requests from check.js.
*/
chrome.runtime.onMessage.addListener(
	function(message, sender, sendResponse) {
		var action = message.action;
		var url = message.url;
		console.log('received message:');
		console.log(action);
		if (action == 'resume_timer') {
			resume_timer(url, sendResponse);
		}
		else if (action == 'pause_timer') {
			pause_timer(url, sendResponse);
		}
		else if (action == 'close_current_tab') {
			close_current_tab();
		}
		else {
			sendResponse({reaction:'unknown action'});
		}
		return true;
});

// Resumes the timer for a listed website -> state: resumed
// Afterwards, makes sure that today's date is added to date_time_dict
function resume_timer(url, sendResponse) {
	localStorage['state'] = 'resumed';
	sendResponse({reaction: 'true'});
}

// Pauses the timer for a listed website -> state: paused
function pause_timer(url, sendResponse) {
	localStorage['state'] = 'paused';
	sendResponse({reaction: 'true'});
}

// Closes the current active tab
function close_current_tab() {
	chrome.tabs.query({
		active: true, currentWindow: true
	}, function(tabs) {
		chrome.tabs.remove(tabs[0].id, function() {
			sendResponse({reaction: 'true'});
		});		
	});
}

// Updates the timer
function update_timer(url) {
	if (!localStorage['state'] == 'resumed') {
		return ;
	}
	chrome.storage.sync.get({time_dict: {}, date_time_dict: {}}, 
		function(result) {
			console.log('inside update');
			var timers = result.time_dict;
			console.log(timers);
			// Continue from the previous timer
			if (timers[url]) {
				timers[url] += DELTA_T;
			}
			// If doesn't exist, then create a new one
			else {
				timers[url] = DELTA_T;
			}
			var date_timers = result.date_time_dict;
			var now = new Date().toJSON().slice(0,10)
			// If today's date wasn't added to the dict yet
			if (!date_timers[now]) {
				date_timers[now] = {}
			}
			// If the url was not introduced today yet
			if (date_timers[now][url]) {
				date_timers[now][url] += DELTA_T;
			}
			else {
				date_timers[now][url] = DELTA_T;
			}
			var current_timer = timers[url];
			chrome.storage.sync.set(
				{time_dict: timers, date_time_dict: date_timers}, function() {
					console.log(current_timer);
					console.log(date_timers);
				}
			);
		}
	);
}

// Calls an update on time if there is focus on the window
function update_timer_check() {
	chrome.tabs.query({active: true, currentWindow: true},
		function(tabs) {
			chrome.windows.get(tabs[0].windowId, 
				function(window) {
					var url = tabs[0].url;
					if (window.focused) {
						chrome.storage.sync.get({pages: []}, function(result) {
							var websites = result.pages;
							var current_url;
							for (var i=0; i<websites.length; i++) {
								current_url = websites[i];
								if (url.indexOf(current_url) > -1) {
									console.log(url+" is monitored");
									return update_timer(current_url);
								}
							}
							console.log(url+" is not monitored");
							return false;
						});
					}
					else {
						console.log("window not focused");
						return ;
					} 
				});
		});
}

// Force an update of the timer every minute. 
window.setInterval(update_timer_check, DELTA_T);



