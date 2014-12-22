var MINUTE = 60000;

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
			resume_timer(url);
		}
		else if (action == 'pause_timer') {
			pause_timer(url);
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
function resume_timer(url) {
	localStorage['state'] = 'resumed';
	sendResponse({reaction: 'true'});
}

// Pauses the timer for a listed website and saves it
function pause_timer(url) {
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
		var timers = result.time_dict;
		console.log(timers);
		var current_timer;
		// Continue from the previous timer
		if (timers[url]) {
			console.log('cont timer');
			current_timer = timers[url];
		}
		// If doesn't exist, then create a new one
		else {
			console.log('new timer');
			current_timer = 0;
		}
	});
}

// Force an update of the counter every minute. 
window.setInterval(update_timer, MINUTE);
