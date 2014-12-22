chrome.runtime.onMessage.addListener(
	function(message, sender, sendResponse) {
		console.log('received message');
		console.log(message.greeting);
		if (message.action == 'close_current_tab') {
			chrome.tabs.query({
				active: true, currentWindow: true
			}, function(tabs) {
				sendResponse({reaction: 'a'});
			});
			sendResponse({reaction:'closed the tab'});
		}
		else {
			sendResponse({reaction:'unknown action'});
		}
		
});