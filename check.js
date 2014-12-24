console.log('inside check.js');
/*
* Checks whether the newly launched website is in our list 
* or not, and if so then prompts the dialog
*/
function check_page(url) {
	chrome.storage.sync.get({pages: []}, function(result) {
		var webpages = result.pages;
		console.log(webpages);
		var current;
		for (var i=0; i<webpages.length; i++) {
			current = webpages[i];
			console.log(current);
			if (url.indexOf(current) > -1) {
				console.log('is monitored');
				if (confirm('You spent X hours today, and Y hours this week on N. Are you sure that you want to continue?')) {
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
				return 1;
			}
		}
		console.log('not monitored');
		return 0;
	});
}

var current_page = window.location.href;

check_page(current_page);