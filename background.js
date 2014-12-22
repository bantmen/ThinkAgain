chrome.runtime.onMessage.addListener(
	function(message, sender, sendResponse) {
		console.log('received message');
		console.log(message.greeting);
		if (message.action == 'close_current_tab') {
			chrome.tabs.getCurrent(function(tab) {
				// sendResponse({reaction:'close'});
    			chrome.tabs.remove(tab.id, function() {
    				//
    			});
			});
			sendResponse({reaction:'closed the tab'});
		}
		else {
			sendResponse({reaction:'unknown action'});
		}
		
});