chrome.runtime.onMessage.addListener(
	function(message, sender, sendResponse) {
		console.log('received message:');
		console.log(message.action);
		if (message.action == 'close_current_tab') {
			console.log('inside if');
			chrome.tabs.query({
				active: true, currentWindow: true
			}, function(tabs) {
				console.log('reached');
				chrome.tabs.remove(tabs[0].id, function() {
					sendResponse({reaction: 'true'});
				});		
			});
			//sendResponse({reaction:'closed the tab'});
		}
		else {
			console.log('insid else');
			sendResponse({reaction:'unknown action'});
		}
		return true;
});