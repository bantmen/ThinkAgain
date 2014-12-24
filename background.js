var MINUTE = 60000;
var FAST_MINUTE = MINUTE/5;  // for debugging

localStorage['state'] = 'initialized';

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

// Resumes the timer for a listed website
function resume_timer(url, sendResponse) {
	localStorage['state'] = 'resumed';
	sendResponse({reaction: 'true'});
}

// Pauses the timer for a listed website and saves it
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

function update_timer(url) {
	if (!localStorage['state'] == 'resumed') {
		return ;
	}
	chrome.storage.sync.get({time_dict: {}}, function(result) {
		console.log('inside timer');
		var timers = result.time_dict;
		console.log(timers);
		// Continue from the previous timer
		if (timers[url]) {
			console.log('cont timer');
			timers[url] += FAST_MINUTE;
		}
		// If doesn't exist, then create a new one
		else {
			console.log('new timer');
			timers[url] = FAST_MINUTE;
		}
		var current_timer = timers[url];
		chrome.storage.sync.set({time_dict: timers}, 
			function() {
				console.log(current_timer);
				console.log('set new timer');
			});
	});
}

function is_monitored(url) {
	chrome.storage.sync.get({pages: []}, 
		function(result) {
			var websites = result.pages;
			var current_url;
			for (var i=0; i<websites.length; i++) {
				current_url = websites[i];
				if (current_url.indexOf(url) > -1) {
					return true;
				}
			}
			return false;
		}
	);
}

function update_timer_check() {
	chrome.tabs.query({currentWindow: true}, 
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
								if (current_url.indexOf(url) > -1) {
									return update_timer(url);
								}
							}
							console.log(url+" not monitored");
							return false;
						}
						);
					}
					else {
						console.log("window not focused");
						return ;
					} 
				});
		});
}

// Force an update of the timer every minute. 
window.setInterval(update_timer_check, FAST_MINUTE);
