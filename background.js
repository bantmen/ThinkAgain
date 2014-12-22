/*
* Listns for the requests from check.js.
*/
chrome.runtime.onMessage.addListener(
	function(message, sender, sendResponse) {
		console.log('received message:');
		console.log(message.action);
		if (message.action == 'resume_timer') {
			resume_timer();
		}
		else if (message.action == 'pause_timer') {
			pause_timer();
		}
		else if (message.action == 'close_current_tab') {
			close_current_tab();
		}
		else {
			sendResponse({reaction:'unknown action'});
		}
		return true;
});

// Resumes the timer for a listed website
function resume_timer() {

}

// Pauses the timer for a listed websit
function pause_timer() {

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