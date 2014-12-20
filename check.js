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
				if (confirm('This website is on your "Think Again" list! Are you sure that you want to continue?')) {
					console.log('cont.');
				}
				else {
					console.log('not cont.');
					chrome.runtime.sendMessage('test');
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